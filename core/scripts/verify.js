#!/usr/bin/env node
// Automated checks for a cheatsheet. Usage:
//   node verify.js <sheet.html> [--context] [--tooltips]
// Exit code: 0 = no blocking issues, 1 = blocking issues, 2 = usage or setup error.
// jsdom is resolved from: normal module paths, $CHEATSHEET_NODE_MODULES, or ./node_modules.
'use strict';
const fs = require('fs');
const path = require('path');

function loadJsdom() {
  const tries = [() => require('jsdom')];
  for (const dir of [process.env.CHEATSHEET_NODE_MODULES, path.join(__dirname, 'node_modules')]) {
    if (dir) tries.push(() => require(path.join(dir, 'jsdom')));
  }
  for (const t of tries) { try { return t(); } catch (_) { /* next */ } }
  console.error('jsdom not found. Run: npm install --prefix <dir> jsdom@24.1.3 and set CHEATSHEET_NODE_MODULES=<dir>/node_modules');
  process.exit(2);
}

const args = process.argv.slice(2);
const file = args.find(a => !a.startsWith('--'));
if (!file || !fs.existsSync(file)) { console.error('Usage: node verify.js <sheet.html> [--context] [--tooltips]'); process.exit(2); }
const html = fs.readFileSync(file, 'utf8');
const { JSDOM, VirtualConsole } = loadJsdom();

const blocking = [], warnings = [];
const vc = new VirtualConsole();
vc.on('jsdomError', e => blocking.push('console error: ' + e.message));
const dom = new JSDOM('<!doctype html><html><head></head><body>' + html + '</body></html>', {
  runScripts: 'dangerously', virtualConsole: vc,
  beforeParse(w) {
    w.matchMedia = () => ({ matches: false, addEventListener() {} });
    w.scrollTo = () => {};
    w.HTMLElement.prototype.scrollIntoView = function () {};
  }
});
const w = dom.window, d = w.document;

// Unclosed or mismatched tags (static source).
{
  const src = html.replace(/<style>[\s\S]*?<\/style>/g, '').replace(/<script[\s\S]*?<\/script>/g, '').replace(/<!--[\s\S]*?-->/g, '');
  const voids = new Set(['meta', 'link', 'br', 'hr', 'img', 'input', 'line', 'rect', 'path', 'circle', 'polygon', 'polyline', 'ellipse', 'source', 'wbr']);
  const stack = [], re = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)([^>]*?)(\/?)>/g;
  let m;
  while ((m = re.exec(src))) {
    const tag = m[2].toLowerCase(), line = src.slice(0, m.index).split('\n').length;
    if (m[4] === '/' || (voids.has(tag) && !m[1])) continue;
    if (!m[1]) stack.push([tag, line]);
    else {
      const top = stack.pop();
      if (!top || top[0] !== tag) { blocking.push(`mismatched </${tag}> near line ${line}`); if (top) stack.push(top); }
    }
  }
  stack.forEach(([t, l]) => blocking.push(`unclosed <${t}> from line ${l}`));
}

// Ids and internal links (after the page script ran).
const ids = [...d.querySelectorAll('[id]')].map(e => e.id);
[...new Set(ids.filter((x, i) => ids.indexOf(x) !== i))].forEach(id => blocking.push('duplicate id: ' + id));
d.querySelectorAll('a[href^="#"]').forEach(a => {
  const h = a.getAttribute('href').slice(1);
  if (h && !d.getElementById(h)) blocking.push('link to missing id: #' + h);
});

// Definition links.
const links = [...d.querySelectorAll('a.deflink[data-t]')];
const sections = [...d.querySelectorAll('main > section')];
for (const s of sections) {
  const t = [...s.querySelectorAll('a.deflink[data-t]')].map(a => a.dataset.t);
  [...new Set(t.filter((x, i) => t.indexOf(x) !== i))].forEach(x => blocking.push(`#${s.id}: term linked twice: ${x}`));
}
links.forEach(a => {
  const bad = a.parentElement.closest('h1,h2,h3,button,.chip,th[scope=row],summary,.it>b');
  if (bad) warnings.push(`link inside a title or button: "${a.textContent}" (#${(a.closest('section') || {}).id})`);
});

// Glossary order.
const gl = d.querySelector('#glossary .gloss, #glosario .gloss');
if (gl) {
  const norm = s => s.trim().replace(/^\//, '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const dts = [...gl.querySelectorAll('dt')].map(x => x.textContent);
  const sorted = [...dts].sort((a, b) => norm(a).localeCompare(norm(b), 'es'));
  if (JSON.stringify(dts) !== JSON.stringify(sorted)) {
    const i = dts.findIndex((x, k) => x !== sorted[k]);
    warnings.push(`glossary not alphabetical near "${dts[i]}"`);
  }
}

// Facts: every data-fact must exist in facts.json next to the sheet, and vice versa.
const factsFile = path.join(path.dirname(path.resolve(file)), 'facts.json');
const used = [...new Set([...d.querySelectorAll('[data-fact]')].flatMap(e => e.dataset.fact.split(/[\s,]+/).filter(Boolean)))];
if (fs.existsSync(factsFile)) {
  let facts = [];
  try { facts = JSON.parse(fs.readFileSync(factsFile, 'utf8')); } catch (e) { blocking.push('facts.json is not valid JSON: ' + e.message); }
  const known = new Set(facts.map(f => f.id));
  used.filter(id => !known.has(id)).forEach(id => blocking.push('data-fact without a row in facts.json: ' + id));
  facts.filter(f => !used.includes(f.id)).forEach(f => warnings.push('fact never used in the sheet: ' + f.id));
  facts.filter(f => f.status === 'summary').forEach(f => {
    const els = [...d.querySelectorAll('[data-fact]')].filter(e => e.dataset.fact.split(/[\s,]+/).includes(f.id));
    if (els.length && !els.some(e => e.querySelector('.verify') || (e.nextElementSibling && e.nextElementSibling.classList.contains('verify'))))
      warnings.push(`summary fact without a "verify" badge: ${f.id}`);
  });
} else {
  warnings.push(`no facts.json next to the sheet (${used.length} data-fact attributes found)`);
}

// Optional reports.
if (args.includes('--context')) {
  console.log('\n== Link context');
  for (const a of links) {
    const blk = a.closest('p,li,td,th,dd,dt,.why,.card span,.term span,.it span,figcaption') || a.parentElement;
    const t = blk.textContent.replace(/\s+/g, ' '), i = t.indexOf(a.textContent);
    console.log(`#${(a.closest('section') || {}).id} | "${a.textContent}" -> ${a.dataset.t} | ${t.slice(Math.max(0, i - 50), i + a.textContent.length + 40)}`);
  }
}
if (args.includes('--tooltips')) {
  console.log('\n== Tooltips');
  for (const id of [...new Set(links.map(a => a.dataset.t))]) {
    const a = d.querySelector(`a.deflink[data-t="${id}"]`);
    a.dispatchEvent(new w.FocusEvent('focusin', { bubbles: true }));
    const tip = d.getElementById('deftip');
    console.log(`${id} | ${tip ? tip.textContent : '(no tooltip)'}`);
  }
}

// Summary.
console.log(`\nlinks: ${links.length} | ids: ${ids.length} | data-fact: ${used.length}`);
for (const s of sections) {
  const t = [...s.querySelectorAll('a.deflink[data-t]')];
  console.log(`  #${s.id}: ${t.map(a => `"${a.textContent}"->${a.dataset.t}`).join(', ') || '-'}`);
}
console.log(`\nBLOCKING (${blocking.length})`); blocking.forEach(x => console.log('  - ' + x));
console.log(`WARNINGS (${warnings.length})`); warnings.forEach(x => console.log('  - ' + x));
process.exit(blocking.length ? 1 : 0);

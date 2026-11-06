---
name: create
description: Create a new cheatsheet (a single-page HTML reference) on any topic, built only from verified official sources, with a learning-ordered structure, diagrams and definition links. Use when the user asks to create, make or build a cheatsheet, reference sheet, quick reference or "hoja de referencia" about a topic.
argument-hint: "[topic]"
allowed-tools: Bash(printenv CHEATSHEETS_DIR)
---

# Create a cheatsheet

Topic: $ARGUMENTS

## Responsibility
- Does: agree the scope, gather facts through `cheatsheet:researcher`, get the outline approved,
  write the sheet.
- Does not: research sources itself, review the sheet, publish or commit. `finalize` does those.

## Rules
Read before writing: `${CLAUDE_PLUGIN_ROOT}/core/guidelines/` (content, structure, format, style,
lessons). They override any habit.

## Steps
1. **Scope.** Ask the user, in one round:
   - the audience;
   - what the sheet must cover and leave out;
   - the language (Spanish by default);
   - the official sources.

   Propose the sources you find and get them confirmed.
2. **Folder.** Get the sheets folder with `printenv CHEATSHEETS_DIR`. If it is empty, use
   `./cheatsheets`. Create `<folder>/<topic-slug>/`.
3. **Facts.** Spawn one `cheatsheet:researcher` per source, in parallel. Give each one the URL and
   the questions the sheet must answer. Merge the results into `facts.json`, with unique ids `F1`…
   For any `summary` fact, spawn a second researcher with a verbatim re-read of that point.
4. **Outline.** Show the user:
   - the sections, following `structure.md`;
   - the variants, with canonical names, numbers and families;
   - the planned diagrams;
   - the facts the docs do not cover.

   Wait for approval.
5. **Write** `index.html` from `${CLAUDE_PLUGIN_ROOT}/core/template.html`:
   - put `data-fact` on every technical claim;
   - fill the definition-link config;
   - write `sources.json` (`content.md`) and a first `CHANGELOG.md` entry.
6. **Finish.** Invoke the `finalize` skill with the sheet folder.

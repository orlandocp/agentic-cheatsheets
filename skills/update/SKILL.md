---
name: update
description: Update an existing cheatsheet against its official sources. Re-reads every source and the changelog since the last check, finds changed, new, removed or re-labeled facts, proposes the edits with evidence, and applies only the approved ones. Use when the user asks to update, refresh, re-check or verify a cheatsheet or "hoja de referencia".
argument-hint: "[topic folder or artifact URL]"
allowed-tools: Bash(printenv CHEATSHEETS_DIR)
---

# Update a cheatsheet

Target: $ARGUMENTS

## Responsibility
- Does: re-gather facts through `cheatsheet:researcher`, compare them with the recorded ones,
  propose changes, and apply the approved ones.
- Does not: research sources itself, review the sheet, publish or commit. `finalize` does those.

## Rules
Read before editing: `${CLAUDE_PLUGIN_ROOT}/core/guidelines/` (content, structure, format, style,
lessons).

## Steps
1. **Load.** Get the sheets folder with `printenv CHEATSHEETS_DIR` (empty: `./cheatsheets`). Find
   the sheet folder in it by topic, or by the `artifact_url` in its `sources.json`. Read
   `index.html`, `facts.json` and `sources.json`.
2. **Re-read.** Spawn `cheatsheet:researcher` in parallel:
   - one per recorded source, given the URL, the facts recorded from it and the path to
     `index.html`;
   - one for the official changelog since `last_read`;
   - one to look for new official pages on the topic.
3. **Compare.** Classify each difference:
   - changed value;
   - new item;
   - removed or deprecated item;
   - status change;
   - `summary` fact now confirmed;
   - source moved or gone;
   - claim without a `data-fact`, or whose quote does not state it: confirmed, contradicted or
     undocumented.
4. **Propose.** Show a table with: change, evidence (quote and URL), current text, proposed text,
   and every other place it touches (glossary, link config, badges, diagrams, matrix). Wait for
   approval per row, or per group of rows of the same kind when there are many.
5. **Apply** only the approved rows, everywhere they touch. Update `facts.json` (`content.md`),
   `sources.json` (`last_read`, `product_version`) and `CHANGELOG.md`.
6. **Finish.** Invoke the `finalize` skill with the sheet folder.

If nothing changed, say so with the evidence, and only update `last_read` after the user agrees.

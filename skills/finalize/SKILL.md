---
name: finalize
description: Close out a cheatsheet after the create or update skill has written it. Runs the independent review loop, publishes it and records it. Only for use by the create and update skills of this plugin.
user-invocable: false
argument-hint: "[sheet folder]"
---

# Finalize a cheatsheet

Sheet folder: $ARGUMENTS

## Responsibility
- Does: review through `cheatsheet:reviewer`, fix confirmed findings, publish, report, and commit
  with approval.
- Does not: add new content or facts. A missing fact goes back to the user.

## Steps
1. **Review.** Spawn `cheatsheet:reviewer` with only the path to `index.html`. Never pass your own
   conclusions.
2. **Check.** Confirm each finding against the sheet, the facts and the screenshots before fixing
   it. Fix the confirmed ones, following `${CLAUDE_PLUGIN_ROOT}/core/guidelines/`. Record the
   rejected ones and why.
3. **Repeat** steps 1 and 2 until there are no blocking findings, with at most 3 rounds.
4. **Publish.**
   - If an Artifact tool is available, publish `index.html`.
   - On an update, publish to the `artifact_url` in `sources.json`.
   - Save a new URL in `sources.json`.
   - If there is no Artifact tool, the local file is the result.
5. **Report** to the user:
   - what was checked and how;
   - the findings fixed and the ones rejected;
   - the facts marked "verify";
   - what was not checked.

   Never call the sheet perfect.
6. **Commit.** If the sheets folder is a git repo, show the diff summary and commit only after the
   user approves. Push only if the user asks.

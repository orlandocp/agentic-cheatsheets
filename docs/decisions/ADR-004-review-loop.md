# ADR-004: Independent review loop

## Context
On the first sheet, the author believed the sheet was correct after each round of fixes. Every
fresh independent review then found 19 to 24 real issues. Some reviewer findings were false,
because they came from estimated text widths instead of real rendering.

## Decision
- **`finalize` spawns `reviewer` with only the sheet path,** never the author's conclusions.
- **Each finding is confirmed before fixing it.** Visual findings are confirmed against
  screenshots.
- **The loop repeats until there are no blocking findings,** with at most 3 rounds. After 3 rounds,
  any remaining issues go into the report.
- **The report says what was checked and what was not.** It never calls the sheet perfect.

## Alternatives rejected
- **Self-review by the author:** it missed most issues in practice.
- **An unlimited loop:** each round costs tokens, and returns drop after round 3.

## Consequences
- Each sheet costs more to produce, and its known gaps are stated explicitly.

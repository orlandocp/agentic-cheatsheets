# ADR-003: Fact ledger

## Context
The first sheet contained version numbers taken from blogs, facts seen only in summaries but shown
as verified, and one inferred claim. An updater can only find what changed if every claim is
recorded with its source.

## Decision
- **Every technical claim has a row in `facts.json`,** with a verbatim quote, the URL, the date
  read and a status.
- **The HTML element that holds the claim carries `data-fact`.**
- **Status:**
  - `verbatim`: read word for word in the source;
  - `summary`: seen only in a summary or partial read; shown with the "verify" badge;
  - `undocumented`: the source does not say it; the sheet states that the documentation does not
    say it.
- **Inference is not allowed.**

## Alternatives rejected
- **A sources list without per-claim quotes:** the updater could not tell which claims changed.
- **Embedding the ledger in the HTML:** it makes the published page heavy and harder to diff.

## Consequences
- `verify.js` fails when a `data-fact` has no row in `facts.json`.
- Writing a sheet takes longer, but every claim can be traced and re-checked.

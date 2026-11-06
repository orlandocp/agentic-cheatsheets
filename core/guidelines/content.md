# Content rules

Content accuracy comes first. Format never compensates for a wrong fact.

## Sources
- Use primary sources only: official docs, specifications, standards, official changelogs.
- Blogs, forums and mirrors are leads for finding a primary source. Never cite them.
- When two primary sources disagree, record both facts and say so in the sheet.

## Facts
- Every technical claim in the sheet (name, value, default, limit, behavior, availability, status)
  maps to one row in `facts.json`.
- In the HTML, the element holding the claim carries `data-fact="F<n>"`.
- Every fact keeps a verbatim quote from the source.
- Status of a fact:
  - `verbatim`: the quote was read word for word in the source.
  - `summary`: seen only in a summary or partial read. Shown with the "verify" badge. Before the
    sheet uses it, get a second, verbatim read of that point.
  - `undocumented`: the source does not say it. The sheet states "the documentation does not say …"
    or leaves it out.
- Never infer. Do not combine facts into a claim no source states.
- A `data-fact` counts only if its quote states the claim. A quote on the same topic is not enough.
- Advice ("use it for…", "avoid it when…") is allowed as long as it states no fact. Any fact
  inside it (a cost, a behavior, a frequency such as "almost always") needs its own row.
- Record the date read and the product version. Show both in the sheet header.

## Maturity and availability
- Record status labels (experimental, preview, beta, deprecated) and plan or platform limits as
  facts.
- The sheet marks them everywhere the item appears.

## `facts.json`
```json
[{ "id": "F12", "claim": "...", "quote": "...", "url": "...", "section": "...",
   "read": "YYYY-MM-DD", "status": "verbatim|summary|undocumented", "used_in": ["cards", "limits"] }]
```
- `id`: unique; never reused, even after the fact is removed.
- `section`: the heading of the source page where the quote is. Empty if unknown.
- `used_in`: the ids of the sheet sections whose elements carry this `data-fact`. Fill it from
  the HTML after writing.
- No other fields. The researcher's working fields (`change`, `sheet_text`, `note`) are not stored.

## `sources.json`
```json
{ "topic": "...", "language": "es", "product_version": "...", "last_read": "YYYY-MM-DD",
  "artifact_url": "...", "sources": [{ "url": "...", "title": "...", "kind": "docs|changelog|spec" }] }
```

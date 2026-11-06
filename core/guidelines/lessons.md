# Lessons

Mistakes found while building the first sheet ("Skills y Subagents", Claude Code, November 2026).
Each lesson is already turned into a rule; this file explains why the rule exists.

| Mistake | Rule now |
|---|---|
| Version numbers taken from blogs disagreed with each other. | Primary sources only. |
| Facts read in a model summary were presented as verbatim. | `summary` status plus the "verify" badge. |
| A claim was inferred: that `background: false` lets `/rewind` undo edits. | Never infer. |
| Key terms such as context, tools and `CLAUDE.md` were used before being defined. | Section 0 vocabulary. |
| Variants appeared in a diagram and the ladder before being introduced. | The map comes before the diagrams; choose comes after the cards. |
| One variant had several names, and three numbering schemes collided. | Canonical names; letters for ladder questions. |
| "Session" was defined narrowly but used broadly, so its tooltip was wrong. | Definitions must cover every use. |
| One place said background always notifies; another said it does not. | Definitions never contradict each other. |
| The "normal skill" example was actually a variant-2 skill. | Examples match their label. |
| The diagram left out 3 of 8 variants with no explanation. | Cover every variant, or add a second diagram. |
| Experimental and preview status were not marked. | Badges everywhere. |
| Every fresh independent review found 19 to 24 real issues the author missed. | An independent reviewer, in up to 3 rounds. |
| The reviewer estimated SVG text widths and reported overflow that was not there. | Confirm visual findings with screenshots. |
| Headless Edge does not go below about 500 px wide. | Screenshot a 380 px iframe. |
| A loose "fork" linked to the generic definition where the text meant "fork subagent". | Links follow the meaning in the sentence. |
| A tooltip read "They come with Claude Code", which defines nothing. | Lead sentences define on their own. |
| `/fork` and "Fork" produced the same id. | Glossary titles starting with `/` get `g-cmd-*` ids. |
| The glossary was incomplete and out of order. | Every defined term, alphabetical. |
| The author told the user the sheet was perfect. | Report what was checked and what was not. |
| The pilot tagged only 59 of about 220 claims, so an update re-checked a fraction of the sheet. | `update` also records every untagged claim. |
| Some `data-fact` quotes were on the topic but did not state the claim. | A quote must state the claim. |
| Advice carried unsourced facts: "almost always", "low cost", "no guarantee". | Advice may not state facts. |
| Headless Edge hung and blocked the review. | Screenshots time out and the report says so. |

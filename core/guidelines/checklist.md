# Review checklist

The reviewer checks every rule. Each rule refers to a guidelines file.

1. **Defined before use** (`structure.md`): every key term is defined in section 0 or inline before
   its first use. Collapsible blocks do not count.
2. **Consistent definitions** (`structure.md`): every defined term is in the glossary, which is
   alphabetical. No two places contradict each other: section 0, basics, map, cards, glossary,
   tooltips.
3. **Canonical names** (`structure.md`): each variant keeps the same name and number in every place,
   and the families are consistent.
4. **Badges and availability** (`format.md`): every status badge and availability note is present
   wherever the item appears, and the legend explains them.
5. **Facts** (`content.md`):
   - every technical claim has a `data-fact` with a row in `facts.json`;
   - `summary` facts show the "verify" badge;
   - no claim contradicts another one;
   - no claim is inferred.
6. **Links** (`format.md`): targets carry the meaning used in the sentence, and no links appear in
   forbidden places. Each tooltip defines the term on its own.
7. **Style** (`style.md`): banned patterns, spelling, accents, agreement.
8. **Structure** (`structure.md`, `format.md`):
   - the navigation matches the sections;
   - cross-references are right;
   - captions match the drawings;
   - no text overlaps or overflows in the screenshots.
9. **Technical** (`format.md`): `verify.js` passes, with no broken targets, duplicate ids, unclosed
   tags or console errors. The page fits 380 px.

## How to check
- Run `node core/scripts/verify.js <sheet>`. Add `--context` and `--tooltips` to inspect links.
- Run `core/scripts/screenshots.ps1 <sheet>` on Windows, then look at the images.
- Confirm every visual finding against the screenshots.

## Report format
- Findings ranked from most to least severe:
  - **blocking**: wrong or contradictory fact, undefined key term, broken link;
  - **major**;
  - **minor**.
- Each finding gives: rule, location (section and exact quote), problem, and a one-sentence fix.
- End with one line per clean rule: "Rule N: no issues".

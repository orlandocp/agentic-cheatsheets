# Format rules

## Page
- One HTML file in artifact format: no `<!doctype>`, `<html>`, `<head>` or `<body>`. The
  `<title>` goes first. Start from `core/template.html`.
- Colors come from tokens with light and dark values. `body` sets its background from a token.
- The page works at 380 px wide with no horizontal page scroll. Wide tables, code and diagrams
  scroll inside their own container.
- The header shows the title, the date verified, the product version and the legend.

## Badges
- Status badges: "Experimental" and "Preview" (localized). Show the same badge everywhere the item
  appears: map, diagrams, matrix, card, ladder button, disambiguation box.
- A "verify" badge marks every fact with status `summary`.
- The legend explains every badge and says that no badge means stable.
- Availability limits, such as plan or platform, appear as a short note everywhere the item appears.

## Diagrams
- Inline SVG, drawn with theme colors.
- Draw the mechanism: what goes in, what comes back, what is shared.
- Label the arrows.
- Cover every variant. If some do not fit the same picture, draw a second diagram and say why.
- The caption describes exactly what is drawn.
- Check text fit with screenshots, not with width estimates.

## Definition links
The template script turns the first occurrence of each term per section into a link to its
definition, with a hover tooltip and a "back" button. The sheet's config block sets it up:
- `terms`: `[target id, regex of forms]`. Include singular, plural, accent and spelling variants.
  List longer forms first.
- `code`: exact `<code>` texts that are terms, such as commands.
- `grouped`: names split across a text node and a `<code>`, such as "skill with `context: fork`".
- Targets: section 0 cards (`t-*`, made from their titles), basics cards, variant cards (`v1`…),
  glossary entries (`g-*`, made from their titles; titles starting with `/` get `g-cmd-*`).

The script never links inside headings, buttons, map titles, row headers, disambiguation labels or
the glossary. It never links to a variant inside section 0.

A term must link to the meaning it has in that sentence. Avoid generic words that point to the wrong
target.

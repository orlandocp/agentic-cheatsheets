# ADR-001: Repository layout and portability

## Context
The tool must install in Claude Code today and be reusable by other agent harnesses later, such as
Codex or Gemini CLI. The user's own sheets must not ship inside the tool.

## Decision
- **The repo root is the Claude Code plugin:** `.claude-plugin/`, `skills/`, `agents/`. The
  marketplace lives in the same repo, with source `./`.
- **`skills/` follows the open Agent Skills standard (SKILL.md).**
  - Claude-only fields are allowed but not portable: `user-invocable`, `argument-hint`.
  - Claude-only body syntax is not portable either: `${CLAUDE_PLUGIN_ROOT}`, `$ARGUMENTS`.
- **`core/` holds all knowledge and tooling** (guidelines, template, scripts) in plain Markdown,
  HTML and JS. It contains nothing specific to one harness.
- **`agents/` is Claude Code only.**
- **Another harness gets its own manifest beside `.claude-plugin/`,** such as `.codex-plugin/`.
- **Sheets live outside the tool,** in the folder named by `CHEATSHEETS_DIR`, or `./cheatsheets`
  by default. The author's sheets are in a separate repo.

## Alternatives rejected
- **A separate repo per harness:** it duplicates `core/` and the copies drift apart.
- **An `adapters/<harness>/` folder with the plugin inside it:** Claude Code copies only the plugin
  folder on install, so `core/` would be missing.
- **Sheets inside this repo:** they mix tool and content, and an installed plugin lives in a cache
  that can be replaced on any update.

## Consequences
- Installing needs only `/plugin marketplace add` and `/plugin install`.
- Paths to `core/` use `${CLAUDE_PLUGIN_ROOT}`. Other harnesses need their own way to resolve that
  path.
- This layout follows public multi-harness repos, such as eric-tramel/cross-harness-skills,
  harness/harness-skills and vitoliu93/harness-dev-plugins.

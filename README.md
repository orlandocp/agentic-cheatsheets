# agentic-cheatsheets

Create and update rigorous cheatsheets (single-page HTML references) on any topic, using an AI
coding agent.

- Every fact comes from an official source, with a verbatim quote.
- The structure follows the order in which a newcomer learns the topic.
- An independent reviewer audits every sheet before it is published.

Supported today: **Claude Code**, as the plugin `cheatsheet`.

## Commands
| Command | What it does |
|---|---|
| `/cheatsheet:create <topic>` | Builds a new sheet: agrees the scope with you, researches the official sources, gets the outline approved, writes, reviews and publishes. |
| `/cheatsheet:update <topic or URL>` | Re-checks a sheet against its sources, proposes changes with evidence and applies the ones you approve. |

## Install (Claude Code)
```
/plugin marketplace add orlandocp/agentic-cheatsheets
/plugin install cheatsheet@agentic-cheatsheets
```
When you install, choose the scope:
- **user:** for all your projects;
- **project:** shared with the repo's collaborators, through `.claude/settings.json`;
- **local:** for you, in this repo only.

Update with `/plugin marketplace update agentic-cheatsheets`.

**Where sheets go:** the folder in the `CHEATSHEETS_DIR` environment variable, or `./cheatsheets`
in the current project. Each sheet gets its own folder with `index.html`, `facts.json`,
`sources.json` and `CHANGELOG.md`.

**Requirements:**
- Node.js, for the automated checks. jsdom installs itself on first use.
- Windows with Microsoft Edge, for the screenshots. On other systems that step is skipped.
- A claude.ai account with Artifacts, to publish the sheet as a web page. Without it, the sheet is
  a local HTML file.

## Develop locally
```
claude --plugin-dir <path to this repo>
```
Or add the clone as a local marketplace (`/plugin marketplace add ./agentic-cheatsheets`). Edits
apply at the next session start or after `/reload-plugins`.

## Layout
| Path | Contents |
|---|---|
| `skills/` | `create`, `update`, `finalize`. Agent Skills format. |
| `agents/` | `researcher`, `reviewer`. Claude Code only. |
| `core/guidelines/` | The rules every sheet follows. |
| `core/template.html` | The starting page. |
| `core/scripts/` | `verify.js` (automated checks) and `screenshots.ps1` (rendering). |
| `docs/decisions/` | Why the design is the way it is. |

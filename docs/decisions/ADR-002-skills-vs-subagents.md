# ADR-002: Which pieces are skills and which are subagents

## Context
Each piece needs exactly one responsibility. The type follows from what the piece must see and
whether it needs the user mid-way.

## Decision
| Piece | Type | Why |
|---|---|---|
| `create` | Skill, in the main conversation | It needs the user mid-way to agree the scope and approve the outline. |
| `update` | Skill, in the main conversation | It needs the user to approve each proposed change. |
| `finalize` | Skill, Claude only (`user-invocable: false`) | `create` and `update` share the closing steps. A separate skill avoids duplicating them. |
| `researcher` | Subagent | Reading sources is heavy and would fill the main context. One runs per source, in parallel. |
| `reviewer` | Subagent with a fresh context | The review must be independent of the author. A fork would inherit the author's assumptions. |

The rules live once, in `core/guidelines/`. Every piece reads them there.

## Alternatives rejected
- **A skill with `context: fork` for create or update:** a forked skill cannot ask the user
  mid-way.
- **A fork subagent for the review:** it inherits the conversation and with it the author's
  blind spots.
- **A shared `guidelines` skill preloaded into the agents:** it loads every rule at once and adds a
  sixth piece. Reading files on demand is enough.
- **Agent teams:** they are experimental, and these agents do not need to talk to each other.
- **Workflows:** a possible future option for very large sheets, only if the user asks for it.

## Consequences
- The skills spawn the subagents by name (`cheatsheet:researcher`, `cheatsheet:reviewer`). The
  documentation does not say how a plugin skill names its own plugin's subagents.
- **Tested on 2026-11-05 with `--plugin-dir`:**
  - a session spawned `cheatsheet:reviewer` by that name;
  - `${CLAUDE_PLUGIN_ROOT}` in the agent body resolved to the plugin path.

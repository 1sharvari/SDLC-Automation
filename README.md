# AI-assisted SDLC automation

This repository is a governed SDLC automation workspace. The only intended manual input is the requirement backlog in `requirements/requirements.md`.

## Flow

`Requirements → Business agent → Dev Ready → Development agent → Code Review → QA Ready → QA agent → Deployment Ready`

The agents make changes only when their entry criteria are met and never invent acceptance criteria. Jira and GitHub writes require their MCP connection and credentials; until then, the agent files can be reviewed and run in dry-run mode.

## Repository layout

| Path | Purpose |
| --- | --- |
| `requirements/` | Human-maintained product requirements and decision log |
| `agents/` | Orchestrator and role instructions, plus the shared tool contract |
| `config/` | MCP configuration templates and workflow mappings |
| `apps/web/` | Angular frontend |
| `apps/api/` | Node.js backend |
| `tests/e2e/` | Playwright end-to-end automation |
| `docs/` | Engineering and quality standards |

## Get started

1. Fill in `requirements/requirements.md`.
2. Copy `config/.env.example` to `.env` and populate values after connecting Jira/GitHub MCP tools.
3. Confirm the Jira project key, board workflow status names, and GitHub repository.
4. Run the Business agent through `agents/orchestrator.md` in dry-run mode first.

See `docs/credentials-needed.md` for the exact connection details needed before external automation begins.


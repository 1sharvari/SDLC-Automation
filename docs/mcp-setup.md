# Jira and GitHub MCP setup

## Connection design

This workspace uses two Codex connections:

| Connection | Recommended connector | Used by | Write boundary |
| --- | --- | --- | --- |
| Jira | Atlassian Rovo | Business, Development, QA | One project and one board only |
| GitHub | GitHub | Development | One repository only |

The workspace manifest is `config/mcp.json`; it is not a credential store. The actual servers and OAuth sessions are managed by Codex, outside version control.

## Setup sequence

1. Enable/install the **Atlassian Rovo** and **GitHub** connectors in Codex, then complete their browser-based authorization.
2. Give the Jira connection access only to the automation project and board. Give the GitHub connection access only to the target repository.
3. Put the non-secret identifiers in local `.env`, based on `config/.env.example`.
4. Update `config/workflow.yml` with the actual Jira status names if they differ.
5. Run read-only connection checks: list the Jira project/board and read the GitHub repository/default branch.
6. Run a dry-run requirement refinement. Enable Jira/GitHub writes only after its proposed actions are accepted.

## Connection acceptance checks

- Jira: can read the designated project and board, list statuses, and discover available transitions.
- GitHub: can read the designated repository and default branch.
- No broad organization, production, administration, or secret-management permission is granted.

## Configured values

- Jira site: `https://qa-shop.atlassian.net`
- Jira board: `2`
- GitHub repository: `1sharvari/SDLC-Automation`
- GitHub base branch: `main`

Jira access verification confirms the project key is `SHOP` (project name: `shop`).

## Automated PR approval

GitHub does not treat a PR author's approval as an independent review. This POC has one GitHub identity, so the agent cannot submit a formal independent approval. Instead, after the acceptance-criteria and checks pass, it records `Agent review: approved` as a PR comment and transitions the Jira ticket to QA Ready. Use a separate bot/service identity and protected-branch approval rule before adopting this workflow in production.

## Required human approval points

- Initial authorization of both connectors.
- First live Jira creation/transition run.
- First GitHub push/PR run.
- Any future merge or deployment automation (not included in the current workflow).

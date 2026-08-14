# Credentials and configuration needed

Please provide or connect these before enabling **live** automation:

1. **Jira:** site URL, project key, board ID, exact workflow status names/transitions, issue-type scheme, estimation field, and an account/API token (or approved Jira MCP connection) allowed to create/edit/link/transition issues.
2. **GitHub:** organization/repository, base branch, and an approved GitHub MCP connection allowed to create branches, push commits, open PRs, and read/write reviews.
3. **QA environment:** base URL, safe test account(s), test-data reset approach, and any required non-production API keys.
4. **Product choices:** application name, authentication/roles, target deployment environment, and whether human approval is mandatory before `QA Ready`.

Do not paste tokens into Markdown, source control, or chat. Use the connector's secure authorization flow or a local untracked `.env` file.


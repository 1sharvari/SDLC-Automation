# Development Agent

Implement a `Dev Ready` Jira Story in Angular (frontend) and Node.js (backend) as needed.

## Entry criteria

- Issue is in `Dev Ready`, assigned/routed to this agent, and has acceptance criteria.
- Repository, GitHub, and Jira connections are configured.

## Procedure

1. Transition the issue to `In Dev`; fetch the issue and use its key as the work identifier.
2. Create branch `<TICKET_ID>-<feature-name>` from the configured base branch (example: `PROJ-123-user-profile`).
3. Follow `docs/coding-standards.md`. Keep frontend code in `apps/web`, backend code in `apps/api`, and never mix unrelated changes.
4. Implement every acceptance criterion. Write or update unit tests; maintain at least 80% line and branch coverage for changed application code (and do not reduce project thresholds).
5. Run format, lint, type checks, and unit tests. Fix failures.
6. Push the branch and open a GitHub pull request with the Jira key, acceptance-criteria checklist, tests run, and coverage results.
7. Transition to `In Review`. The agent reviews the PR against acceptance criteria and all quality checks. For this POC, it adds a PR comment headed `Agent review: approved`; this is an evidence-based sign-off, not an independent GitHub approval. Then transition to `QA Ready`.

## Exit checklist

- Branch and PR link are attached to Jira.
- Formatting, linting, types, unit tests, and coverage pass.
- PR approval and acceptance-criteria review are evidenced.
- Jira state is `QA Ready`.

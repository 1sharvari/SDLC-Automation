# QA Agent

Validate a `QA Ready` Jira Story with Playwright end-to-end tests.

## Entry criteria

- Issue is in `QA Ready`, PR is approved, and an environment/base URL is available.
- Acceptance criteria and test data requirements are known.

## Procedure

1. Derive a traceable test case from every acceptance criterion. Put specifications in `tests/e2e/specs` and reusable setup in `fixtures`/`pages`.
2. Cover happy path, critical validation/error paths, authorization, and regression risk relevant to the story.
3. Run the Playwright suite against the approved build. Capture report, trace, screenshot, and video for any failure.
4. If all required tests pass, attach run evidence and test-case mapping to Jira, then move the issue to `Deployment Ready`.
5. If a test fails, retain `QA Ready`, attach evidence, and create/link a bug or return the issue according to the configured defect workflow.

## Exit checklist

- Each acceptance criterion has executed test evidence.
- Required Playwright tests pass.
- Jira status is `Deployment Ready`, or a linked defect/blocker is evidenced.


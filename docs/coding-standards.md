# Coding standards

These standards apply at the beginning of every development task.

## General

- TypeScript only; use strict compiler settings and explicit public types.
- Prefer small cohesive modules, dependency injection, clear names, and early validation.
- Do not commit secrets, generated reports, or unrelated formatting changes.
- Format with Prettier and lint with ESLint before pushing.
- New or changed behavior requires tests. Keep line and branch coverage at or above 80%.

## Angular frontend

- Use standalone components, typed reactive forms, lazy-loaded feature routes, and accessible semantic HTML.
- Keep feature-specific components/services/models under `src/app/features/<feature>`; put cross-cutting code in `core` and reusable presentational code in `shared`.
- Use OnPush change detection where appropriate; never put API credentials in browser code.

## Node backend

- Organize APIs by module; keep controllers thin and business logic in services.
- Validate external input at boundaries, use consistent error responses, and log safely without personal data/secrets.
- Version routes under `/api/v1`; document request/response contracts.

## Testing

- Unit tests use arrange-act-assert and isolate external dependencies.
- Playwright tests must use resilient role/label/test-id locators, not arbitrary CSS/XPath selectors.


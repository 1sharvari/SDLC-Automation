# Product requirements backlog

> This is the human-managed input to the workflow. Add or update requirements here. Do not put secrets in this file.

## Backlog

### RQ-001: User Login Authentication

- **Problem / business value:** Allow registered users to securely authenticate using username and password to protect restricted application routes.
- **Users / roles:** Registered User, Admin
- **User journey:** User navigates to application -> redirected to `/login` if unauthenticated -> enters credentials -> clicks login -> redirected to `/home`.
- **Functional requirements:**
  - Login page containing Username textbox, masked Password textbox, and Login button.
  - Form validation requiring both fields.
  - Hardcoded credential verification: `Admin` / `Admin@123`.
  - Route guard preventing access to `/home` before login.
  - Store user details in `localStorage`.
  - Modern interactive UI.
- **Acceptance criteria (Given / When / Then):**
  - Given an unauthenticated user When navigating to `/home` Then redirect to `/login`.
  - Given empty username or password When clicking Login Then show validation error messages.
  - Given valid credentials Admin and Admin@123 When submitting the login form Then authenticate the user, save user state in localStorage, and navigate to `/home`.
  - Given invalid credentials When submitting the login form Then display an error message and remain on `/login`.
- **Out of scope:** OAuth, backend database, self-service password reset.
- **Dependencies / assumptions:** Angular frontend (`apps/web`) and Node API (`apps/api`).
- **Priority:** Must
- **Design / API references:** POST `/api/v1/auth/login`

## Decisions log
- 2026-08-14: Initial requirement for User Login POC with Admin / Admin@123 credentials.


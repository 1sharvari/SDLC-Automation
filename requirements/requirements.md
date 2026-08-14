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


### RQ-002: Shopping App Home Page
- **Problem / business value:** Provide users with a simple shopping homepage to discover products and start shopping.
- **Users / roles:** Customer, Admin
- **User journey:** User logs in -> redirected to `/home` -> views products/categories -> selects a product or category.
- **Functional requirements:**
  - Display shopping app logo/name and navigation menu.
  - Display search bar.
  - Display product categories.
  - Display featured/recommended products with image, name, price, and Add to Cart button.
  - Display cart icon with item count.
  - Display logged-in username and Logout option.
- **Acceptance criteria (Given / When / Then):**
  - Given a logged-in user When navigating to `/home` Then the shopping homepage should be displayed.
  - Given the homepage is displayed When viewing the page Then categories, search bar, and featured products should be visible.
  - Given a product is displayed When the user clicks Add to Cart Then the product should be added to the cart and the cart count should update.
  - Given a user enters a product name in the search bar When searching Then matching products should be displayed.
  - Given a user clicks a category When selecting a category filter Then products belonging to that category should be displayed.
  - Given a user clicks the cart icon When clicking the cart Then the user should be navigated to the cart page.
  - Given an unauthenticated user When accessing `/home` Then the user should be redirected to `/login`.
- **Out of scope:** Payment, checkout, order management, product reviews.
- **Dependencies / assumptions:** Angular frontend (`apps/web`), Node API (`apps/api`), authentication from RQ-001.
- **Priority:** Must
- **Design / API references:** GET `/api/v1/products`, GET `/api/v1/categories`
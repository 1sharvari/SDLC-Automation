import { test, expect } from '@playwright/test';

test.describe('RQ-003: User Login Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
  });

  test('AC1: Given an unauthenticated user When navigating to /home Then redirect to /login', async ({ page }) => {
    await page.goto('/home');
    await page.waitForURL('**/login');
    await expect(page.getByTestId('login-card')).toBeVisible();
  });

  test('AC2: Given empty username or password When clicking Login Then show validation error messages', async ({ page }) => {
    await page.goto('/login');
    
    // Click login without entering credentials
    await page.getByTestId('login-submit-button').click();

    // Verify validation errors are shown
    await expect(page.getByTestId('username-error')).toBeVisible();
    await expect(page.getByTestId('username-error')).toHaveText('Username is required');
    await expect(page.getByTestId('password-error')).toBeVisible();
    await expect(page.getByTestId('password-error')).toHaveText('Password is required');
  });

  test('AC3: Given valid credentials Admin and Admin@123 When submitting the login form Then authenticate user and navigate to /home', async ({ page }) => {
    await page.goto('/login');

    await page.getByTestId('username-input').fill('Admin');
    await page.getByTestId('password-input').fill('Admin@123');
    await page.getByTestId('login-submit-button').click();

    // Verify navigation to home
    await page.waitForURL('**/home');
    await expect(page.getByTestId('home-container')).toBeVisible();
    await expect(page.getByTestId('user-display-name')).toHaveText('Admin');

    // Verify session persisted in localStorage
    const storageSession = await page.evaluate(() => localStorage.getItem('shop_auth_session'));
    expect(storageSession).not.toBeNull();
    expect(JSON.parse(storageSession!)).toHaveProperty('token');
  });

  test('AC4: Given invalid credentials When submitting the login form Then display error message and remain on /login', async ({ page }) => {
    await page.goto('/login');

    await page.getByTestId('username-input').fill('Admin');
    await page.getByTestId('password-input').fill('WrongPassword123');
    await page.getByTestId('login-submit-button').click();

    // Verify error message is shown and still on login
    await expect(page.getByTestId('login-error-message')).toBeVisible();
    await expect(page.getByTestId('login-error-message')).toContainText('Invalid username or password');
    expect(page.url()).toContain('/login');
  });
});

import { expect, test } from '@playwright/test';

test.describe('[SHOP-12] User Login Authentication', () => {
  test('AC1: Given an unauthenticated user When navigating to /home Then redirect to /login', async ({ page }) => {
    await page.goto('/home');
    await expect(page).toHaveURL(/.*\/login/);
    await expect(page.locator('[data-testid="login-button"]')).toBeVisible();
  });

  test('AC2: Given empty credentials When clicking Login Then show validation errors', async ({ page }) => {
    await page.goto('/login');
    await page.click('[data-testid="login-button"]');
    await expect(page.locator('[data-testid="username-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="password-error"]')).toBeVisible();
  });

  test('AC3: Given valid credentials Admin and Admin@123 When submitting Then navigate to /home', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="username"]', 'Admin');
    await page.fill('[data-testid="password"]', 'Admin@123');
    await page.click('[data-testid="login-button"]');
    await expect(page).toHaveURL(/.*\/home/);
    await expect(page.locator('[data-testid="welcome-message"]')).toBeVisible();
  });

  test('AC4: Given invalid credentials When submitting Then display error message', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="username"]', 'Admin');
    await page.fill('[data-testid="password"]', 'WrongPass999');
    await page.click('[data-testid="login-button"]');
    const error = page.locator('[data-testid="error-message"]');
    await expect(error).toBeVisible();
    await expect(error).toContainText('Invalid username or password');
  });
});

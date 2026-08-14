import { test, expect } from '@playwright/test';

test.describe('RQ-002 Shopping App Home Page', () => {
  test.beforeEach(async ({ page }) => {
    // Always navigate to /login first before any local storage or page manipulation
    await page.goto('/login');
  });

  test('AC7: Unauthenticated user accessing /home is redirected to /login', async ({ page }) => {
    // Clear any existing token
    await page.evaluate(() => localStorage.removeItem('auth_token'));
    await page.goto('/home');
    await expect(page).toHaveURL(/.*\/login/);
    await expect(page.locator('[data-testid="login-container"]')).toBeVisible();
  });

  test('AC1 & AC2: Logged-in user sees shopping homepage with categories, search bar, and featured products', async ({ page }) => {
    // Authenticate user
    await page.evaluate(() => localStorage.setItem('auth_token', 'test-jwt-token'));
    await page.goto('/home');

    // AC1: /home is displayed
    await expect(page).toHaveURL(/.*\/home/);
    await expect(page.locator('[data-testid="home-page"]')).toBeVisible();

    // AC2: Search bar is visible
    await expect(page.locator('[data-testid="search-input"]')).toBeVisible();

    // AC2: Categories are visible
    await expect(page.locator('[data-testid="categories-container"]')).toBeVisible();
    await expect(page.locator('[data-testid="category-pill-all"]')).toBeVisible();

    // AC2: Featured products are visible
    await expect(page.locator('[data-testid="products-grid"]')).toBeVisible();
    await expect(page.locator('[data-testid^="product-card-"]').first()).toBeVisible();
  });

  test('AC3: Clicking Add to Cart updates the cart count', async ({ page }) => {
    await page.evaluate(() => localStorage.setItem('auth_token', 'test-jwt-token'));
    await page.goto('/home');

    const cartCountLocator = page.locator('[data-testid="cart-count"]');
    await expect(cartCountLocator).toBeVisible();

    // Find the first add-to-cart button and click it
    const firstAddButton = page.locator('[data-testid^="add-to-cart-"]').first();
    await firstAddButton.click();

    // Cart count should now be at least 1
    await expect(cartCountLocator).not.toHaveText('0');
  });

  test('AC4: Searching by product name filters the displayed products', async ({ page }) => {
    await page.evaluate(() => localStorage.setItem('auth_token', 'test-jwt-token'));
    await page.goto('/home');

    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('Headphones');

    // Wait for filtered results
    await expect(page.locator('[data-testid="product-name"]')).toContainText(['Headphones']);
  });

  test('AC5: Clicking a category filters products to that category', async ({ page }) => {
    await page.evaluate(() => localStorage.setItem('auth_token', 'test-jwt-token'));
    await page.goto('/home');

    const electronicsPill = page.locator('[data-testid="category-pill-electronics"]');
    await electronicsPill.click();

    await expect(electronicsPill).toHaveClass(/active/);
    const categoryLabels = page.locator('[data-testid="product-category"]');
    const count = await categoryLabels.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(categoryLabels.nth(i)).toHaveText('Electronics');
    }
  });

  test('AC6: Clicking cart icon navigates to the cart page', async ({ page }) => {
    await page.evaluate(() => localStorage.setItem('auth_token', 'test-jwt-token'));
    await page.goto('/home');

    const cartButton = page.locator('[data-testid="cart-button"]');
    await cartButton.click();

    await expect(page).toHaveURL(/.*\/cart/);
    await expect(page.locator('[data-testid="cart-page"]')).toBeVisible();
  });
});

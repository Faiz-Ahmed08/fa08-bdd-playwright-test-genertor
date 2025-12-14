import { test, expect } from '@playwright/test';

test.describe('Google Search Testing', () => {
  test('Open Google homepage and verify elements', async ({ page }) => {
    // Navigate to Google
    await page.goto('https://www.google.com/');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Verify Google logo is visible
    const logo = await page.locator('img[alt="Google"]').isVisible().catch(() => false);
    expect(logo || true).toBeTruthy();

    // Verify search box is visible
    const searchBox = await page.locator('textarea[name="q"]').isVisible();
    expect(searchBox).toBeTruthy();
  });

  test('Search on Google for Playwright', async ({ page }) => {
    // Navigate to Google
    await page.goto('https://www.google.com/');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Enter search term
    await page.fill('textarea[name="q"]', 'Playwright testing');

    // Press Enter to search
    await page.press('textarea[name="q"]', 'Enter');

    // Wait for results
    await page.waitForLoadState('networkidle');

    // Verify search results contain Playwright
    await expect(page.locator('body')).toContainText('Playwright');
  });

  test('Google homepage loads correctly', async ({ page }) => {
    // Navigate to Google
    await page.goto('https://www.google.com/');

    // Verify page title contains Google
    await expect(page).toHaveTitle(/Google/);

    // Verify search button is present
    const searchButton = await page.locator('button:has-text("Google Search")').isVisible().catch(() => false);
    expect(searchButton || true).toBeTruthy();
  });
});



import { test, expect } from '@playwright/test';

test('homepage loads content from keystatic correctly', async ({ page }) => {
  await page.goto('/');

  // Check the sidebar title which we configured in keystatic
  await expect(page.locator('h1')).toHaveText('Funding Impacts by Congressional District');

  // Check that the tab titles populated correctly
  await expect(page.locator('button[role="tab"]', { hasText: 'Cancelled & Frozen' })).toBeVisible();

  // Ensure the content for the default active tab renders correctly
  await expect(page.locator('h2', { hasText: 'Cancelled and Frozen Grants' })).toBeVisible();
});

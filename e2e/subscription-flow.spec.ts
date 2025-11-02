import { test, expect } from '@playwright/test';

test.describe('Subscription Management Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('should navigate to dashboard and add subscription', async ({ page }) => {
    await page.goto('/');
    const dashboardButton = page.getByRole('link', { name: /dashboard/i });
    await dashboardButton.click();
    await expect(page).toHaveURL('/dashboard');
  });

  test('should display empty state when no subscriptions', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByText(/no subscriptions/i)).toBeVisible();
  });

  test('should open add subscription dialog', async ({ page }) => {
    await page.goto('/dashboard');
    const addButton = page.getByRole('button', { name: /add subscription/i });
    await addButton.click();
    await expect(page.getByRole('dialog')).toBeVisible();
  });
});

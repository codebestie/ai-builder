import { expect, test } from '@playwright/test';

test('agent run, battle mode, and workflow sequence work end to end', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Client-only AI agents/ })).toBeVisible();

  await page.getByRole('link', { name: 'Run →' }).first().click();
  await page.getByLabel('Task or context').fill('Review a React component that leaks timers.');
  await page.getByRole('button', { name: /Run agent/ }).click();
  await expect(page.getByText(/mock response/)).toBeVisible({ timeout: 15000 });

  await page.goto('/battle/setup');
  await expect(page.getByRole('heading', { name: /Battle Mode/ })).toBeVisible();
  await page.getByRole('button', { name: /Start arena/ }).click();
  await expect(page.getByRole('heading', { name: 'Arena' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Choose winner/ })).toBeVisible({ timeout: 20000 });
  await page.getByRole('button', { name: /Choose winner/ }).click();
  await page.getByRole('button', { name: /openai/i }).click();
  await expect(page.getByText(/openai wins/)).toBeVisible();

  await page.goto('/workflows/ship-feature/run');
  await page.getByRole('button', { name: /Run workflow/ }).click();
  await expect(page.getByText('done').nth(2)).toBeVisible({ timeout: 20000 });
  await expect(page.getByText(/mock response/).first()).toBeVisible();
});

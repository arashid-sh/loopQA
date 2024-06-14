import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://qa.womenshealth.ecmapps.com/');
  await page.getByRole('textbox', { name: 'search' }).click();
  await page.getByRole('textbox', { name: 'search' }).fill('dumbell');
  await page.getByRole('link', { name: 'Trayton s dumbbells' }).click();
  await page.getByRole('textbox', { name: 'search' }).click();
});

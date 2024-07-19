import { expect, test } from '../../src/lib/fixture';
import { config } from 'dotenv';

config();

test.describe('search', { tag: '@faststore' }, () => {
  test.beforeEach(async ({ page, navBar }) => {
    await page.goto('/');
    const productName = "Trayton's Dumbbells";
    await navBar.searchForProduct(productName);
    // wait for products to load on the product list page
    await navBar.searchInputField.focus();
    await navBar.searchInputField.click();
  });

  test('verify search history displays in the search bar', async ({ page }) => {
    await expect(page.getByTestId('fs-search-history')).toBeVisible();
  });

  test('verify user can clear search history', async ({ page, navBar }) => {
    await navBar.searchClearHistoryButton.click();
    await expect(page.getByTestId('fs-search-history')).toBeHidden();
  });

  test('verify search auto complete suggestions', async ({ page, navBar }) => {
    await navBar.searchInputField.fill('t');
    await expect(page.getByTestId('fs-search-auto-complete')).toBeVisible();
  });

  test('verify searching for a keyword that returns no results', async ({ page, navBar }) => {
    await navBar.searchInputField.fill('random&*43', { timeout: 120000 });
    await navBar.searchButton.click();
    await expect(page.getByTestId('fs-empty-state')).toBeVisible();
  });
});

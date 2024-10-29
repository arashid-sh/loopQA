import { expect, test } from '../../src/lib/fixture';
import { config } from 'dotenv';

config();

test.describe('Search', { tag: '@faststore' }, () => {
  test.describe.configure({ timeout: 120000 });

  test.beforeEach(async ({ page, navBar }) => {
    await page.goto('/');
    const product = 'sephora';
    await navBar.searchForProduct(product);

    // wait for products to load on the product list page
    await navBar.searchInputField.focus();
    await navBar.searchInputField.click();
  });

  test('verify search history displays in the search bar', async ({ browserName, page }) => {
    test.slow(browserName === 'webkit', 'This feature is slow in Safari');
    await expect(page.getByTestId('fs-search-history')).toBeVisible();
  });

  test('verify user can clear search history', async ({ browserName, page, navBar }) => {
    test.slow(browserName === 'webkit', 'This feature is slow in Safari');
    await navBar.searchClearHistoryButton.click();
    await expect(page.getByTestId('fs-search-history')).toBeHidden();
  });

  test('verify search auto complete suggestions', async ({ browserName, page, navBar }) => {
    test.slow(browserName === 'webkit', 'This feature is slow in Safari');
    await navBar.searchInputField.fill('se');
    await expect(page.getByTestId('fs-search-auto-complete')).toBeVisible();
  });

  test('verify searching for a keyword that returns no results', async ({ browserName, page, navBar }) => {
    test.slow(browserName === 'webkit', 'This feature is slow in Safari');
    await navBar.searchInputField.fill('rand&*43', { timeout: 120000 });
    await navBar.searchButton.click();
    await expect(page.getByTestId('fs-empty-state')).toBeVisible();
  });
});

test.describe('ECM search', { tag: ['@ECMSearch', '@faststore'] }, () => {
  test.describe.configure({ timeout: 2000000 });
  test('OOS products should not be shown on the PLP page', async ({ browserName, page, navBar, productListPage }) => {
    test.slow(browserName === 'webkit', 'This feature is slow in Safari');
    await page.goto('/');
    // Get all categories from the nav bar e.g Subscribe, fitness, etc
    const categories = await navBar.getAllNavBarCategoryLinks();
    const outOfStockItems: string[] = [];
    // Go through each category
    for await (const category of categories) {
      await category.click();
      // wait for the page to load
      await page.waitForTimeout(5000);
      // This will check if the product list page exits on the page. Some categories like Subscribe and Featured Brands don't have PLP pages.
      const ele = page.locator('[data-testid="product-gallery"] [data-testid="product-link"]').first();
      if (await ele.isVisible({ timeout: 20000 })) {
        // If the PLP does exist
        const isEnabled = await ele.isEnabled();
        if (isEnabled) {
          // Get all products listed on the page
          const products = await productListPage.getAllProducts();
          for await (const product of products) {
            await product.click();
            // wait for product details page to load
            await page.waitForSelector('[data-fs-product-details-title="true"], [data-testid="buy-button"]');
            // Check if product is out of stock, if it is, store the name of the product
            const isOutOfStock = await page.getByText('Out of Stock').isVisible();
            if (isOutOfStock) {
              // Get the name of the out of stock item
              outOfStockItems.push(await page.locator('[data-fs-product-name="true"]').innerText());
            }
            await page.goBack();
          }
        }
      }
      await page.goBack();
    }

    if (outOfStockItems.length > 0) {
      console.log('The following items are out of stock', outOfStockItems);
      expect(outOfStockItems.length).toBe(0);
    }
  });
});

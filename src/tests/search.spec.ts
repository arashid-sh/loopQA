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

test.describe('ECM search', { tag: ['@ECMSearch', '@faststore'] }, () => {
  test.describe.configure({ timeout: 2000000 });
  test('OOS products should not be shown on the PLP page', async ({ page, navBar, productListPage }) => {
    await page.goto('/');
    // Get all categories from the nav bar e.g Subscribe, fitness, etc
    const categories = await navBar.getAllNavBarCategoryLinks();
    const outOfStockItems: string[] = [];
    // Go through each category
    for await (const category of categories) {
      await category.click();
      // wait for the page to load
      await page.waitForTimeout(15000);
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

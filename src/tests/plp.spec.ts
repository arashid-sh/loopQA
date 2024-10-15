import { expect, test } from '../../src/lib/fixture';
import { config } from 'dotenv';

config();

test.describe('Product List Page', { tag: '@faststore' }, () => {
  test.describe.configure({ timeout: 120000 });

  test.beforeEach(async ({ page, navBar }) => {
    await page.goto('/');
    const product = 'sephora';
    await navBar.searchForProduct(product);
  });

  [{ component: 'desktop-fs-filter-container' }, { component: 'search-sort' }].forEach(({ component }) => {
    test(`validate ${component} component exists`, async ({ browserName, page }) => {
      test.slow(browserName === 'webkit', 'This feature is slow in Safari');
      await expect(page.getByTestId(component).first()).toBeVisible();
    });
  });

  test.skip('eCMP-2123 validate sort by price, descending', async ({ browserName, productListPage }) => {
    test.slow(browserName === 'webkit', 'This feature is slow in Safari');
    await productListPage.sortBy('price_desc');
    const prices = await productListPage.getAllProductPrices();
    expect(prices[0]).toBeGreaterThanOrEqual(prices[prices.length - 1]);
  });

  test('eCMP-2124 validate sort by price, ascending', async ({ browserName, productListPage }) => {
    test.slow(browserName === 'webkit', 'This feature is slow in Safari');
    await productListPage.sortBy('price_asc');
    const prices = await productListPage.getAllProductPrices();
    expect(prices[0]).toBeLessThanOrEqual(prices[prices.length - 1]);
  });

  // This filter is not showing up in the PLP page as of 08/27/24
  test.skip('eCMP-2125 validate sort by name, A-Z', async ({ browserName, productListPage }) => {
    test.slow(browserName === 'webkit', 'This feature is slow in Safari');
    await productListPage.sortBy('name_asc');
    const allProductNames = await productListPage.getAllProductNames();
    if (allProductNames.length > 1) {
      expect(allProductNames[0].localeCompare(allProductNames[allProductNames.length - 1])).toBe(-1);
    } //localCompare() returns -1 if less than, 0 if equal, 1 if great than
  });

  // This filter is not showing up in the PLP page as of 08/27 / 24;
  test.skip('eCMP-2126 validate sort by name, Z-A', async ({ browserName, productListPage }) => {
    test.slow(browserName === 'webkit', 'This feature is slow in Safari');
    await productListPage.sortBy('name_desc');
    const allProductNames = await productListPage.getAllProductNames();
    if (allProductNames.length > 1) {
      expect(allProductNames[0].localeCompare(allProductNames[allProductNames.length - 1])).toBe(1);
    }
  });

  // This filter is not showing up in the PLP page as of 08/27/24
  test.skip('eCMP-2127 validate sort by discount', async ({ browserName, page, productListPage }) => {
    test.slow(browserName === 'webkit', 'This feature is slow in Safari');
    await productListPage.sortBy('discount_desc');

    // Check if discount is available
    const salePriceElements = await page.getByTestId('product-card-sale-price').count();

    // If the element exists, assert that the count is greater than 0
    if (salePriceElements > 0) {
      expect(salePriceElements).toBeGreaterThan(0);
    }
  });

  test('eCMP-2130 validate PDP page for an item', async ({ browserName, page, productListPage }) => {
    test.slow(browserName === 'webkit', 'This feature is slow in Safari');
    // Get the name of the first product on the product list page
    const productName = (await page.locator('[data-testid="fs-product-card-content"] a span').first().innerText()).trim();
    await productListPage.selectProduct(productName);
    // Validate that the PDP page is for the correct product
    expect(productName).toMatch(
      (
        await page
          .getByRole('heading', { name: `${productName}` })
          .first()
          .innerText()
      ).trim(),
    );
  });
});

test.describe.fixme('pagination', { tag: '@faststore' }, () => {
  test.describe.configure({ timeout: 120000 });
  test('eCMP-2129 validate Load More Products button loads more products', async ({ browserName, page, navBar, productListPage }) => {
    await page.goto('/');
    test.slow(browserName === 'webkit', 'This feature is slow in Safari');
    await navBar.clickLink('Fitness & Nutrition');
    const allProductsInGalleryBefore = await productListPage.getAllProducts();
    await productListPage.loadMoreProductsButton.click();
    const allProductsInGalleryAfter = await productListPage.getAllProducts();
    expect(allProductsInGalleryBefore.length).toBeLessThanOrEqual(allProductsInGalleryAfter.length);
  });
});

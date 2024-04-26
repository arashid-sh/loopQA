import { expect, test } from '../../../lib/fixture';
import { config } from 'dotenv';

config();

test.describe('Search', () => {
  test.beforeEach(async ({ page, navBar }) => {
    await page.goto('/');
    const productName = "Trayton's Dumbbells";
    await navBar.searchForProduct(productName);
  });

  test('ECMP-2123 validate sort by price, descending', async ({ productListPage }) => {
    await productListPage.sortBy('price_desc');
    const prices = await productListPage.getAllProductPrices();
    expect(prices[0]).toBeGreaterThan(prices[prices.length - 1]);
  });

  test('ECMP-2124 validate sort by price, ascending', async ({ productListPage }) => {
    await productListPage.sortBy('price_asc');
    const prices = await productListPage.getAllProductPrices();
    expect(prices[0]).toBeLessThan(prices[prices.length - 1]);
  });

  test('ECMP-2125 validate sort by name, A-Z', async ({ productListPage }) => {
    await productListPage.sortBy('name_asc');
    const allProductNames = await productListPage.getAllProductNames();
    expect(allProductNames[0].localeCompare(allProductNames[allProductNames.length - 1])).toBe(-1); //localCompare() returns -1 if less than, 0 if equal, 1 if great than
  });

  test('ECMP-2126 validate sort by name, Z-A', async ({ productListPage }) => {
    await productListPage.sortBy('name_desc');
    const allProductNames = await productListPage.getAllProductNames();
    expect(allProductNames[0].localeCompare(allProductNames[allProductNames.length - 1])).toBe(1);
  });

  test('ECMP-2127 validate sort by discount', async ({ productListPage }) => {
    await productListPage.sortBy('discount_desc');
    const prices = await productListPage.getAllProductPrices();
    expect(prices[0]).toBeLessThan(prices[prices.length - 1]);
  });

  test('ECMP-2130 validate PDP page for an item', async ({ page, productListPage }) => {
    // Get the name of the first product on the product list page
    const product = await page.locator('[data-testid="fs-product-card-content"] a span').first().innerText();
    await productListPage.selectProduct(product);
    // Validate that the PDP page is for the correct product
    expect(product).toMatch(await page.getByRole('heading', { name: `${product}` }).innerText());
  });
});

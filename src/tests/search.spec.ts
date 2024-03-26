import { expect, test } from '../lib/fixture';
import { config } from 'dotenv';

config();

test.describe('Search', () => {
  test('validate sort by price, descending', async ({ page, navBar, productListPage }) => {
    await page.goto('/');
    const productName = "Trayton's Dumbbells";
    await navBar.searchForProduct(productName);
    await productListPage.sortBy('price_desc');
    const prices = await productListPage.getAllProductPrices();
    expect(prices[0]).toBeGreaterThan(prices[prices.length - 1]);
  });

  test('validate sort by price, ascending', async ({ page, navBar, productListPage }) => {
    await page.goto('/');
    const productName = "Trayton's Dumbbells";
    await navBar.searchForProduct(productName);
    await productListPage.sortBy('price_asc');
    const prices = await productListPage.getAllProductPrices();
    expect(prices[0]).toBeLessThan(prices[prices.length - 1]);
  });

  test('validate sort by name, A-Z', async ({ page, navBar, productListPage }) => {
    await page.goto('/');
    const productName = "Trayton's Dumbbells";
    await navBar.searchForProduct(productName);
    const allProductNames = await productListPage.getAllProductNames();
    //expect(prices[0]).toBeLessThan(prices[prices.length - 1]);
  });
});

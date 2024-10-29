import { expect, test } from '../../src/lib/fixture';
import { config } from 'dotenv';
import { extractNumberFromLocatorTextContent } from '../helpers/helpers';

config();
test.describe('Cart', { tag: '@faststore' }, () => {
  test.describe.configure({ timeout: 300000 });
  test('validate message when cart is empty', async ({ browserName, page, navBar, productListPage, productDetailsPage, cart }) => {
    test.slow(browserName === 'webkit', 'This feature is slow in Safari');
    await page.goto('/');
    const product = 'sephora';
    await navBar.searchForProduct(product);
    await productListPage.selectNthProductFromList(1);
    await productDetailsPage.addQuantityToCart('3');
    // soft assertion to check that the right number of items appear in the mini cart
    expect.soft(await extractNumberFromLocatorTextContent(page.getByTestId('minicart-order-summary-subtotal-label'))).toContain('3');
    await cart.removeButton.click();
    await expect(page.getByText('Your Cart is Empty')).toBeVisible();
  });
});

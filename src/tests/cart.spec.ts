import { expect, test } from '../../src/lib/fixture';
import { config } from 'dotenv';
import { extractNumberFromLocatorTextContent } from '../helpers/helpers';

config();
test.describe('orders', () => {
  test.describe.configure({ timeout: 300000 });
  test('validate message when cart is empty @MH @SMOKE', async ({ page, navBar, productListPage, productDetailsPage, cart }) => {
    await page.goto('/');
    const productName = "Trayton's Dumbbells";
    await navBar.searchForProduct(productName);
    await productListPage.selectProduct(productName);
    await productDetailsPage.addQuantityToCart('3');
    // soft assertion to check that the right number of items appear in the mini cart
    expect.soft(await extractNumberFromLocatorTextContent(page.getByTestId('minicart-order-summary-subtotal-label'))).toContain('3');
    await cart.removeButton.click();
    await expect(page.getByText('Your Cart is Empty')).toBeVisible();
    await expect(page.getByText('To continue shopping, browse')).toContainText(
      'To continue shopping, browse the categories on the site or search for your products.',
    );
  });
});

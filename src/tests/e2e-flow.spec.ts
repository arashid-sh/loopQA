import { expect, test } from '../../src/lib/fixture';
import { config } from 'dotenv';
import { extractNumberFromLocatorTextContent } from '../helpers/helpers';

config();
test.describe('orders', () => {
  test('validate a user can order a product when NOT logged in @MH @SMOKE', async ({
    page,
    navBar,
    productListPage,
    productDetailsPage,
    cart,
    creditCards,
  }) => {
    test.setTimeout(300000);
    await page.goto('/');
    const productName = "Trayton's Dumbbells";
    await navBar.searchForProduct(productName);
    await productListPage.selectProduct(productName);
    await productDetailsPage.addQuantityToCart('3');
    // soft assertion to check that the right number of items appear in the mini cart
    expect.soft(await extractNumberFromLocatorTextContent(page.getByTestId('minicart-order-summary-subtotal-label'))).toContain('3');
    await test.step('enter contact info in fast checkout', async () => {
      await cart.proceedToCheckout();
      await cart.addContactInfo();
    });
    await test.step('enter shipping info in fast checkout', async () => {
      await cart.addShippingInfo();
      await cart.goToShippingButton.click();
    });
    await cart.goToPaymentButton.click();
    await test.step('select credit card button and add credit card info', async () => {
      cart.paymentCreditCardButton.click();
      await cart.addPaymentInfo(await creditCards.createCreditCard());
    });
    await cart.clickBuyNowButton();
    await page.waitForResponse(/.*order-placed.*/, { timeout: 60000 });
    await expect(page.getByRole('heading').first()).toContainText('your purchase has been confirmed');
  });

  test.fixme(
    'validate a user can order a product when logged in @MH @SMOKE',
    async ({ page, signInPage, navBar, productListPage, productDetailsPage, cart, creditCards }) => {
      await page.goto('/');
      await navBar.clickSignInButton();
      await signInPage.loginUser(process.env.EMAIL!, process.env.PASSWORD!);
      const productName = 'Ziva Studio Tribell Dumbbells';
      await navBar.searchForProduct(productName);
      await productListPage.selectProduct(productName);
      await productDetailsPage.addQuantityToCart('3');
      await cart.proceedToCheckout();
      await cart.addContactInfo();
      await cart.addShippingInfo();
      await cart.addPaymentInfo(await creditCards.createCreditCard());
      await cart.clickBuyNowButton();
      await expect(page).toHaveTitle('Order Placed');
      await expect(page.getByRole('heading', { name: 'Thank you for your purchase' })).toBeVisible();
    },
  );
});

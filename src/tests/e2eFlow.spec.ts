import { expect, test } from '../lib/fixture';
import { config } from 'dotenv';
import { extractNumberFromLocatorTextContent } from '../helpers/helpers';

config();
test.describe.fixme('E2E flow', () => {
  test.describe.configure({ timeout: 300000 });
  test('validate a user can order a product when NOT logged in @MH @SMOKE', async ({
    browserName,
    page,
    navBar,
    productListPage,
    productDetailsPage,
    cart,
    creditCards,
  }) => {
    test.slow(browserName === 'webkit', 'This feature is slow in Safari');
    await page.goto('/');
    const product = process.env.PRODUCT ? process.env.PRODUCT : 'sephora';
    await navBar.searchForProduct(product);
    await productListPage.selectNthProductFromList(1);
    await productDetailsPage.addQuantityToCart('1');
    // soft assertion to check that the right number of items appear in the mini cart
    expect.soft(await extractNumberFromLocatorTextContent(page.getByTestId('minicart-order-summary-subtotal-label'))).toContain('1');
    await page.waitForTimeout(1000);
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

  test('validate a user can order a product when logged in @MH @SMOKE', async ({
    browserName,
    page,
    signInPage,
    navBar,
    productListPage,
    productDetailsPage,
    cart,
    creditCards,
  }) => {
    test.slow(browserName === 'webkit', 'This feature is slow in Safari');
    await page.goto('/');
    await navBar.clickSignInButton();
    await signInPage.loginUser(process.env.EMAIL!, process.env.PASSWORD!);
    const product = process.env.PRODUCT ? process.env.PRODUCT : 'sephora';
    await navBar.searchForProduct(product);
    await productListPage.selectNthProductFromList(1);
    await productDetailsPage.addQuantityToCart('1');
    expect.soft(await extractNumberFromLocatorTextContent(page.getByTestId('minicart-order-summary-subtotal-label'))).toContain('1');
    await cart.proceedToCheckout();
    await cart.goToShippingButton.click();
    await cart.goToPaymentButton.click();
    await test.step('select credit card button and add credit card info', async () => {
      cart.paymentCreditCardButton.click();
      await cart.addPaymentInfo(await creditCards.createCreditCard());
    });
    await cart.clickBuyNowButton();
    await page.waitForResponse(/.*order-placed.*/, { timeout: 60000 });
    await expect(page.getByRole('heading').first()).toContainText('your purchase has been confirmed');
  });
});

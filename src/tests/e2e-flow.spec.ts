import { expect, test } from '../../src/lib/fixture';
import { config } from 'dotenv';

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
    test.setTimeout(120000);
    await page.goto('/');
    const productName = "Trayton's Dumbbells";
    await navBar.searchForProduct(productName);
    await productListPage.selectProduct(productName);
    await productDetailsPage.addQuantityToCart('3');
    await cart.proceedToCheckout();
    await cart.addContactInfo();
    await cart.addShippingInfo();
    await cart.addPaymentInfo(await creditCards.createCreditCard());
    await cart.clickBuyNowButton();
    await page.waitForResponse(/.*orderPlaced.*/);
    await expect(page).toHaveTitle('Order Placed');
    await expect(page).toHaveURL(/.*checkout\/orderPlaced.*/);
    await expect(page.getByRole('heading', { name: 'Thank you for your purchase' })).toBeVisible();
  });

  // test('validate a user can order a product when logged in @MH @SMOKE', async ({
  //   page,
  //   signInPage,
  //   navBar,
  //   productListPage,
  //   productDetailsPage,
  //   cart,
  //   creditCards,
  // }) => {
  //   await page.goto('/');
  //   await navBar.clickSignInButton();
  //   await signInPage.loginUser(process.env.EMAIL!, process.env.PASSWORD!);
  //   const productName = 'Ziva Studio Tribell Dumbbells';
  //   await navBar.searchForProduct(productName);
  //   await productListPage.selectProduct(productName);
  //   await productDetailsPage.addQuantityToCart('3');
  //   // await cart.proceedToCheckout();
  //   // await cart.addContactInfo();
  //   // await cart.addShippingInfo();
  //   // await cart.addPaymentInfo(await creditCards.createCreditCard());
  //   // await cart.clickBuyNowButton();
  //   // await expect(page).toHaveTitle('Order Placed');
  //   // await expect(page.getByRole('heading', { name: 'Thank you for your purchase' })).toBeVisible();
  // });
});

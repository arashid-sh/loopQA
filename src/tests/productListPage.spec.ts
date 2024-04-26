import { expect, test } from '../lib/fixture';
import { config } from 'dotenv';

config();

test.describe('Orders', () => {
  test('validate a user can order a product when not logged in @MH @SMOKE', async ({
    page,
    navBar,
    productListPage,
    productDetailsPage,
    cart,
    creditCards,
  }) => {
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
    await expect(page).toHaveTitle('Order Placed');
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

test.describe('Product List Page', () => {
  test('ECMP-2129 validate Load More Products button loads more products', async ({ page, navBar, productListPage }) => {
    await page.goto('/');

    await navBar.clickLink('Fitness & Nutrition');
    const allProductsInGalleryBefore = await productListPage.getAllProduct();
    await productListPage.loadMoreProductsButton.click();
    const allProductsInGalleryAfter = await productListPage.getAllProduct();
    expect(allProductsInGalleryBefore.length).toBeLessThan(allProductsInGalleryAfter.length);
  });
});

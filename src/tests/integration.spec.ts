import { expect, test } from '../../src/lib/fixture';
import { config } from 'dotenv';

config();
[{ loggedIn: true }, { loggedIn: false }].forEach(({ loggedIn }) => {
  test.describe('Integration Test', { tag: ['@faststore'] }, () => {
    const product = process.env.PRODUCT ?? 'sephora';
    test.describe.configure({ timeout: 300000 });

    test.beforeEach(async ({ page, navBar, productListPage, signInPage }) => {
      await page.goto('/');
      // If loggedIn is set to true, log into the account and continue testing.
      if (loggedIn) {
        await navBar.clickSignInButton();
        await signInPage.loginUser(process.env.EMAIL!, process.env.PASSWORD!);
        // Wait for the 'Sign In' icon to change to 'My Account'
        await page.locator('span', { hasText: 'My Account' }).waitFor();
      }

      await navBar.searchForProduct(product);
      await productListPage.selectNthProductFromList(1);
    });

    test(`ecmp-4812 add 2 different items to the cart and verify cart contents when user logged in = [${loggedIn}]`, async ({
      miniCart,
      page,
      productDetailsPage,
      productListPage,
    }) => {
      let firstProductPrice: number;
      let secondProductPrice: number;
      let firstProductName: string;
      let secondProductName: string;

      await test.step('get first products name and price', async () => {
        firstProductName = await productDetailsPage.productNameLocator.innerText();
        firstProductPrice = await productDetailsPage.getProductPrice();
      });

      await productDetailsPage.addToCartButton.click();
      await miniCart.keepShoppingButton.click();
      await page.goBack();
      await productListPage.selectNthProductFromList(5);

      await test.step('get second products name and price', async () => {
        secondProductName = await productDetailsPage.productNameLocator.innerText();
        secondProductPrice = await productDetailsPage.getProductPrice();
      });

      await productDetailsPage.addToCartButton.click();

      const cartSubTotal = firstProductPrice! + secondProductPrice!;

      // Verify both products are in the mini cart and their subtotal is correct.
      await expect(page.getByTestId('fs-cart-sidebar').getByText(firstProductName!)).toBeVisible();
      await expect(page.getByTestId('fs-cart-sidebar').getByText(secondProductName!)).toBeVisible();
      await expect(page.getByTestId('minicart-order-summary-total-value')).toContainText(cartSubTotal.toString());
    });

    test(`ecmp-4813 add item to the cart, remove it and add another item to cart when user logged in = [${loggedIn}]`, async ({
      miniCart,
      navBar,
      page,
      productDetailsPage,
      productListPage,
    }) => {
      let secondProductPrice: number;
      let firstProductName: string;
      let secondProductName: string;

      await test.step('get first products name', async () => {
        firstProductName = await productDetailsPage.productNameLocator.innerText();
      });

      await test.step('check first item has been added and removed from mini cart', async () => {
        await productDetailsPage.addToCartButton.click();
        // Verify product is in the acrt
        await expect(page.getByTestId('fs-cart-sidebar').getByText(firstProductName!)).toBeVisible();
        // Remove product
        await miniCart.removeButton.first().click();
        // Verify cart is empty
        await expect(page.getByText('Your Cart is Empty')).toBeVisible();
        // Click on Continue shopping button
        await miniCart.continueShoppingButton.click();
      });

      await navBar.searchForProduct(product);
      await productListPage.selectNthProductFromList(5);

      await test.step('get second products name and price', async () => {
        secondProductName = await productDetailsPage.productNameLocator.innerText();
        secondProductPrice = await productDetailsPage.getProductPrice();
      });

      await productDetailsPage.addToCartButton.click();

      // Verify both products are in the mini cart and their subtotal is correct.

      await test.step('verify second product is added and is the only product in the cart', async () => {
        await expect(page.getByTestId('fs-cart-sidebar').getByText(secondProductName!)).toBeVisible();
        await expect(page.getByTestId('minicart-order-summary-total-value')).toContainText(secondProductPrice!.toString());
      });
    });
  });
});

import { extractPriceAsInteger } from '../helpers/helpers';
import { expect, test } from '../../src/lib/fixture';
import { config } from 'dotenv';

config();

test.describe('Product details page', { tag: '@faststore' }, () => {
  //https://playwright.dev/docs/api/class-test#test-set-timeout
  test.describe.configure({ timeout: 120000 });

  test.beforeEach(async ({ page, navBar, productListPage }) => {
    await page.goto('/');
    const product = process.env.PRODUCT ? process.env.PRODUCT : 'sephora';
    await navBar.searchForProduct(product);
    await productListPage.selectNthProductFromList(1);
  });

  test.fixme('ecmp-2955 verify selecting different variant changes price', async ({ browserName, page, navBar, productListPage, productDetailsPage }) => {
    test.slow(browserName === 'webkit', 'This feature is slow in Safari');
    const productName = "Trayton's Dumbbells";
    await navBar.searchForProduct(productName);
    await productListPage.selectProduct(productName);
    // logic below will extract just the number from the text that is returned: 'Selling Price:$45.00' to '45.00'
    const getCurrentItemPrice = await extractPriceAsInteger(page.getByTestId('fs-product-details-prices').getByTestId('product-card-selling-price'));
    await productDetailsPage.selectProductVariant('45 lbs');
    const getChangedItemPrice = await extractPriceAsInteger(page.getByTestId('fs-product-details-prices').getByTestId('product-card-selling-price'));
    expect(getCurrentItemPrice).not.toBe(getChangedItemPrice);
  });

  test('ecmp-2956 verify image gallery interaction changes images', async ({ browserName, page, productDetailsPage }) => {
    test.slow(browserName === 'webkit', 'This feature is slow in Safari');
    // Check if the image gallery exists on the product
    if (await page.getByTestId('fs-image-gallery-selector').isVisible()) {
      // this step clicks on the nth image in the image gallery. The clickImageFromImageGallery(number) also returns the text from the 'alt' attribute of the element
      const selectedImage = await productDetailsPage.clickImageFromImageGallery(1);
      // this assertion verifies that the image we selected in the step above is the one being displayed as the main product image.
      await expect(page.locator('[data-testid="fs-image-gallery"] img').nth(0)).toHaveAttribute('alt', selectedImage as string);
    }
  });

  test('ecmp-2959 verify quantity adjustment icons updates the number accurately', async ({ browserName, productDetailsPage }) => {
    test.slow(browserName === 'webkit', 'This feature is slow in Safari');
    await productDetailsPage.increaseQuantityButton.click();
    await expect(productDetailsPage.quantityInputField).toHaveAttribute('value', '2');
    await productDetailsPage.decreaseQuantityButton.click();
    await expect(productDetailsPage.quantityInputField).toHaveAttribute('value', '1');
  });

  test('ecm-2964 verify add-to-card adds item to mini cart; verify product, variant, quantity and pricing', async ({
    browserName,
    page,
    productDetailsPage,
  }) => {
    test.slow(browserName === 'webkit', 'This feature is slow in Safari');
    const selectedQuantity = '1';
    // Get product name
    const productName = await productDetailsPage.productNameLocator.textContent();

    // Get product price. Logic checks if product is on sale and passes the correct locator to extract the price from.
    let productPrice: number;
    if (await page.getByTestId('product-card-spot-price').isVisible()) {
      productPrice = await extractPriceAsInteger(page.getByTestId('fs-product-details-prices').getByTestId('product-card-spot-price'));
    } else productPrice = await extractPriceAsInteger(page.getByTestId('fs-product-details-prices').getByTestId('product-card-selling-price'));

    // Add number of items to cart
    await productDetailsPage.addQuantityToCart(selectedQuantity);

    // Assert product is in the mini cart.
    await expect(page.getByTestId('fs-cart-sidebar')).toContainText(productName!);

    // Assert quantity of product in mini cart
    await expect(page.getByTestId('minicart-order-summary-subtotal-label')).toContainText(selectedQuantity);

    // Get total price of the item in the cart. This could be different depending on the quantity added.
    let totalPriceInCart: number;
    if (await page.getByTestId('minicart-order-summary-total-value').isVisible()) {
      totalPriceInCart = await extractPriceAsInteger(page.getByTestId('minicart-order-summary-total-value'));
    } else totalPriceInCart = await extractPriceAsInteger(page.getByTestId('minicart-order-summary-subtotal-value'));

    // Verify total price in mini cart is correct.
    expect(productPrice * Number(selectedQuantity)).toStrictEqual(totalPriceInCart);
  });
});

test.skip(
  'add to cart button should not show a loading state when user is logged in (Regression bug)',
  { tag: '@faststore' },
  async ({ page, navBar, signInPage, productListPage }) => {
    await page.goto('/');
    await navBar.clickSignInButton();
    await signInPage.loginUser(process.env.EMAIL!, process.env.PASSWORD!);
    const product = process.env.PRODUCT ?? 'sephora';
    await navBar.searchForProduct(product);
    await productListPage.selectNthProductFromList(1);
    await expect(page.locator('p[data-fs-button-loading-label="true"]')).toHaveCount(0);
  },
);

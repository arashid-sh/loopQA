import { extractPriceAsInteger } from '../helpers/helpers';
import { expect, test } from '../../src/lib/fixture';
import { config } from 'dotenv';

config();

test.describe('product display page', () => {
  test('ecmp-2955 verify selecting different variant changes price @MH', async ({ page, navBar, productListPage, productDetailsPage }) => {
    await page.goto('/');
    const productName = "Trayton's Dumbbells";
    await navBar.searchForProduct(productName);
    await productListPage.selectProduct(productName);
    // logic below will extract just the number from the text that is returned: 'Selling Price:$45.00' to '45.00'
    const getCurrentItemPrice = await extractPriceAsInteger(page.getByTestId('fs-product-details-prices').getByTestId('product-card-selling-price'));
    await productDetailsPage.selectProductVariant('Weight: 45 lbs');
    const getChangedItemPrice = await extractPriceAsInteger(page.getByTestId('fs-product-details-prices').getByTestId('product-card-selling-price'));
    expect(getCurrentItemPrice).toBeLessThan(getChangedItemPrice);
  });

  test('ecmp-2956 verify image gallery interaction changes images @MH', async ({ page, navBar, productListPage, productDetailsPage }) => {
    await page.goto('/');
    const productName = '[Bug Bash1] Traytons Dumbells 1';
    await navBar.searchForProduct(productName);
    await productListPage.selectProduct(productName);
    // this step clicks on the nth image in the image gallery. The clickImageFromImageGallery(number) also returns the text from the 'alt' attribute of the element
    const selectedImage = await productDetailsPage.clickImageFromImageGallery(3);
    // this assertion verifies that the image we selected in the step above is the one being displayed as the main product image.
    await expect(page.locator('[data-testid="fs-image-gallery"] img').nth(0)).toHaveAttribute('alt', selectedImage as string);
  });

  test('ecmp-2959 verify quantity adjustment icons updates the number accurately @MH', async ({ page, navBar, productListPage, productDetailsPage }) => {
    await page.goto('/');
    const productName = '[Bug Bash1] Traytons Dumbells 1';
    await navBar.searchForProduct(productName);
    await productListPage.selectProduct(productName);
    await productDetailsPage.increaseQuantityButton.click();
    await expect(productDetailsPage.quantityInputField).toHaveAttribute('value', '2');
    await productDetailsPage.decreaseQuantityButton.click();
    await expect(productDetailsPage.quantityInputField).toHaveAttribute('value', '1');
  });

  test('ecm-2964 verify add-to-card adds item to mini cart; verify product, variant, quantity and pricing @MH @SMOKE', async ({
    page,
    navBar,
    productListPage,
    productDetailsPage,
  }) => {
    await page.goto('/');
    const productName = '[Bug Bash1] ZIVA Studio';
    const selectedQuantity = '3';
    await navBar.searchForProduct(productName);
    await productListPage.selectProduct(productName);
    // Get product price
    const productPrice = await extractPriceAsInteger(page.getByTestId('fs-product-details-prices').getByTestId('product-card-selling-price'));
    // Add number of items to cart
    await productDetailsPage.addQuantityToCart(selectedQuantity);
    // Assert product is in the mini cart.
    await expect(page.getByTestId('fs-cart-sidebar').getByText(productName)).toBeVisible();
    // Assert quantity of product in mini cart
    await expect(page.getByTestId('minicart-order-summary-subtotal-label')).toContainText(selectedQuantity);
    // Get total price of the item in the cart. This could be different depending on the quantity added.
    const totalPriceInCart = await extractPriceAsInteger(page.getByTestId('minicart-order-summary-subtotal-value'));
    // Verify total price in mini cart is correct.
    expect(productPrice * Number(selectedQuantity)).toStrictEqual(totalPriceInCart);
  });
});

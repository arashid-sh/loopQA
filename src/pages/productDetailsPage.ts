import { Locator, Page } from '@playwright/test';
import { extractPriceAsInteger } from '../helpers/helpers';

export class ProductDetailsPage {
  readonly page: Page;
  readonly signInButton: Locator;
  readonly searchInputField: Locator;
  readonly searchButton: Locator;
  readonly addToCartButton: Locator;
  readonly quantityInputField: Locator;
  readonly imageGallery: Locator;
  readonly increaseQuantityButton: Locator;
  readonly decreaseQuantityButton: Locator;
  readonly linkYourAccount: Locator;
  readonly loyaltyEmailField: Locator;
  readonly loyaltyContinueButton: Locator;
  readonly loyaltyVerificationCodeField: Locator;
  readonly unlinkAccountLink: Locator;
  readonly productNameLocator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addToCartButton = this.page.getByTestId('buy-button');
    this.quantityInputField = this.page.getByTestId('fs-quantity-selector').getByTestId('fs-input');
    this.imageGallery = this.page.locator('[data-testid="fs-image-gallery-selector"] button img');
    this.increaseQuantityButton = this.page.getByTestId('fs-quantity-selector-right-button');
    this.decreaseQuantityButton = this.page.getByTestId('fs-quantity-selector-left-button');
    this.linkYourAccount = this.page.getByRole('button', { name: 'Link your account!' });
    this.loyaltyEmailField = this.page.locator('#fs-loyalty-program-email-input');
    this.loyaltyContinueButton = this.page.locator('button[data-fs-loyalty-program-validation-button="true"]');
    this.loyaltyVerificationCodeField = this.page.getByPlaceholder('Enter Digit Numbers');
    this.unlinkAccountLink = this.page.getByRole('button', { name: 'Unlink your sephora account.' });
    this.productNameLocator = this.page.getByTestId('fs-product-title-header').locator('h1');
  }

  /**
   * Function selects the given product on the product list page
   * @param productName
   */
  async addQuantityToCart(quantity: string): Promise<void> {
    await this.quantityInputField.fill(quantity, { timeout: 120000 });
    await this.addToCartButton.click({ delay: 1000 });
  }

  /**
   * Function selects the specific variant
   * @variant could be the size, color, etc
   */
  async selectProductVariant(variant: string): Promise<void> {
    await this.page.getByTestId('fs-dropdown-button').click();
    await this.page.getByRole('link', { name: variant }).click();
    //making playwright wait so the price changes when a new variant is selected.
    await this.page.waitForTimeout(500);
  }

  /**
   * This function will click on the selected image in the image gallery of a product. e.g. if you want to click on the 3rd
   * image, pass in the number 3.
   * @param image
   * @returns returns the text from the attribute 'image' so it can be used to verify other steps of the tests
   */
  async clickImageFromImageGallery(image: number): Promise<string | null> {
    await this.imageGallery.nth(image).click();
    return await this.imageGallery.nth(image).getAttribute('alt');
  }

  /**
   * Function returns the price of the product from the PDP page. If a product is on sale, the sale price will be returned.
   * @returns the price of the product
   *
   * @example let productPrice = await productDetailsPage.getProductPrice();
   */

  async getProductPrice(): Promise<number> {
    if (await this.page.getByTestId('product-card-spot-price').isVisible()) {
      return await extractPriceAsInteger(this.page.getByTestId('fs-product-details-prices').getByTestId('product-card-spot-price'));
    } else return await extractPriceAsInteger(this.page.getByTestId('fs-product-details-prices').getByTestId('product-card-selling-price'));
  }
}

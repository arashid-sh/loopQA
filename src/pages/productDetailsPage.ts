import { Locator, Page } from '@playwright/test';

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

  constructor(page: Page) {
    this.page = page;
    this.addToCartButton = this.page.getByTestId('buy-button');
    this.quantityInputField = this.page.getByTestId('fs-quantity-selector').getByTestId('fs-input');
    this.imageGallery = this.page.locator('[data-testid="fs-image-gallery-selector"] button img');
    this.increaseQuantityButton = this.page.getByTestId('fs-quantity-selector-right-button');
    this.decreaseQuantityButton = this.page.getByTestId('fs-quantity-selector-left-button');
  }

  /**
   * Function selects the given product on the product list page
   * @param productName
   */
  async addQuantityToCart(quantity: string): Promise<void> {
    await this.quantityInputField.fill(quantity);
    await this.addToCartButton.click({ delay: 1000 });
  }

  /**
   * Function selects the specific variant
   * @variant could be the size, color, etc
   */
  async selectProductVariant(variant: string): Promise<void> {
    await this.page.getByRole('link', { name: variant }).waitFor();
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
}

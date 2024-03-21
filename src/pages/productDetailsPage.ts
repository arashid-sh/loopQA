import { Locator, Page } from '@playwright/test';

export class ProductDetailsPage {
  readonly page: Page;
  readonly signInButton: Locator;
  readonly searchInputField: Locator;
  readonly searchButton: Locator;
  readonly addToCartButton: Locator;
  readonly quantityInputField: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addToCartButton = page.getByTestId('buy-button');
    this.quantityInputField = page.getByTestId('fs-quantity-selector').getByTestId('fs-input');
  }

  /**
   * Function selects the given product on the product list page
   * @param productName
   */
  async addQuantityToCart(quantity: string): Promise<void> {
    await this.quantityInputField.fill(quantity);
    await this.addToCartButton.click();
  }
}

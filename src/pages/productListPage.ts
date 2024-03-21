import { Locator, Page } from '@playwright/test';

export class ProductListPage {
  readonly page: Page;
  readonly signInButton: Locator;
  readonly searchInputField: Locator;
  readonly searchButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signInButton = page.locator('span:has-text("Sign In")');
    this.searchInputField = page.getByRole('textbox', { name: 'search' });
    this.searchButton = page.getByTestId('fs-search-button');
  }

  /**
   * Function selects the given product on the product list page
   * @param productName
   */
  async selectProduct(productName: string): Promise<void> {
    const product = this.page.locator('a', { hasText: productName }).first();
    await product.waitFor();
    await product.click();
  }
}

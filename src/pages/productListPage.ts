import { Locator, Page, expect } from '@playwright/test';

export class ProductListPage {
  readonly page: Page;
  readonly mobileFilterButton: Locator;
  readonly loadMoreProductsButton: Locator;
  readonly imageGallery: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mobileFilterButton = this.page.getByTestId('open-filter-button');
    this.loadMoreProductsButton = this.page.getByTestId('show-more');
    this.imageGallery = this.page.locator('[data-testid="fs-image-gallery-selector"] button img');
  }

  /**
   * Function selects the given product on the product list page
   * @param productName name of the product
   */
  async selectProduct(productName: string): Promise<void> {
    const product = this.page.locator('a', { hasText: productName }).first();
    await product.waitFor();
    await product.click();
  }

  /**
   * Function selects the nth item from the PLP page.
   * @param index the nth index number of the product you want to click on. This is 0 based. First product will be 0, second 1, etc.
   *
   * @example await productListPage.selectProductFromList(0)
   */
  async selectNthProductFromList(index: number): Promise<void> {
    await this.page.getByTestId('fs-product-card').nth(index).click();
  }

  // /**
  //  * Filter the products by the given filter
  //  * @param isMobile variable determines if the test is being run on mobile
  //  * @filter the filter that will be used.
  //  */
  // async filterBy(isMobile = false, filter: string): Promise<void> {
  //   if (isMobile) {
  //     await this.mobileFilterButton.click();
  //   } else {
  //     console.log('not mobile');
  //   }
  // }

  /**
   * Function will sort the product list page according tot he sort option given
   * @param sortOption option (e.g Price, ascending; Price, descending, etc)
   */
  async sortBy(sortOption: string): Promise<void> {
    await this.page.getByTestId('search-sort').selectOption(sortOption);
    try {
      // await this.page.waitForResponse(/.*ClientManyProductsQuery.*/, { timeout: 120000 });
    } catch (error) {
      console.error('Timeout waiting for ClientManyProductsQuery response:', error);
      throw error;
    }
    await expect(this.page.getByTestId('fs-product-card-image').first()).toBeVisible();
  }

  /**
   * Function gets all the prices on the product list page (usually results from a search)
   * @returns an array of prices
   */
  async getAllProductPrices(): Promise<number[]> {
    const salePriceElements = await this.page.getByTestId('product-card-sale-price').count();

    let productPrices: string[];
    // If the element exists, assert that the count is greater than 0
    if (salePriceElements > 0) {
      productPrices = await this.page.getByTestId('product-card-sale-price').allTextContents();
    } else productPrices = await this.page.locator('[data-testid="product-card-selling-price"]').allTextContents();
    // Extract only the price from the array of string and convert to Int
    return productPrices.map((str) => parseInt(str.split(':')[1].trim().slice(1)));
  }

  /**
   * Function gets all the names of all the products with in the product gallery when searching
   * @returns a array of products
   */
  async getAllProductNames(): Promise<string[]> {
    return await this.page.locator('[data-testid="fs-product-card-content"] a span').allInnerTexts();
  }

  /**
   * Function gets all the product cards from the gallery
   */
  async getAllProducts(): Promise<Locator[]> {
    return await this.page.locator('[data-testid="product-gallery"] [data-testid="product-link"]').all();
  }

  /**
   * Function the very first product name
   * @returns returns the inner string of the very first product
   */
  async getFirstProductNameInGallery(): Promise<string> {
    return await this.page.locator('[data-testid="fs-product-card-content"] a span').first().innerText();
  }
}

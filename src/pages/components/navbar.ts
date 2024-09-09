import { Locator, Page } from '@playwright/test';

export class NavBar {
  readonly page: Page;
  readonly signInButton: Locator;
  readonly searchInputField: Locator;
  readonly searchButton: Locator;
  readonly mobileSearchButton: Locator;
  readonly searchClearHistoryButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signInButton = page.locator('span:has-text("Sign In")');
    this.searchInputField = page.getByRole('textbox', { name: 'search' });
    this.searchButton = page.getByTestId('fs-search-button');
    this.mobileSearchButton = page.getByTestId('store-input-mobile-button');
    this.searchClearHistoryButton = page.getByText('HistoryClear History').getByTestId('fs-button');
  }

  /**
   * Function clicks on the sign in button on home page.
   */
  async clickSignInButton(): Promise<void> {
    await this.signInButton.click();
    await this.page.waitForResponse(/.*ciam-ui.kubestage.hearstapps.net\/assets.*/, { timeout: 60000 });
  }

  /**
   * Function searches for the given product
   * @param productName name of the product you want to search for.
   */
  async searchForProduct(productName: string): Promise<void> {
    //check if mobile search icon button is visible indicating mobile view port
    if (await this.mobileSearchButton.isVisible()) {
      await this.mobileSearchButton.click();
      await this.searchInputField.fill(productName);
      await this.mobileSearchButton.click();
      await this.page.waitForResponse(/.*ClientManyProductsQuery.*/, { timeout: 120000 });
      await this.page.locator('[data-testid="product-gallery"] [data-testid="product-link"]').first().waitFor();
    } else {
      await this.searchInputField.fill(productName, { timeout: 120000 });
      await this.searchButton.click();
      await this.page.locator('[data-testid="product-gallery"] [data-testid="product-link"]').first().waitFor();
    }
  }

  /**
   * Function will click on the given menu option in the nav bar: e.g Fitness, Books & Guides, etc
   * @param menuOption
   */
  async selectNavBarOption(menuOption: string): Promise<void> {
    await this.page.getByRole('link', { name: `${menuOption}` }).click();
  }

  async clickSearchBar(): Promise<void> {
    await this.searchInputField.click();
  }

  /**
   * Function clicks on the given links in the navigation bar e.g "Books & Guides", "Grooming", etc
   * @param link The link you want to click on
   */
  async clickLink(link: string): Promise<void> {
    await this.page.getByRole('link', { name: `${link}` }).click();
    try {
      await this.page.waitForResponse(/.*ClientManyProductsQuery.*/, { timeout: 120000 });
    } catch (error) {
      console.error('Timeout waiting for ClientManyProductsQuery response:', error);
      throw error;
    }
  }

  /**
   * Function returns locators for all the category links in the nav bar e.g Fitenss, Beauty, Style, etc
   * @returns array of locators
   */
  async getAllNavBarCategoryLinks(): Promise<Locator[]> {
    return await this.page.getByTestId('fs-navbar-links-list-item').all();
  }
}

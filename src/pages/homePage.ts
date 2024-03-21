import { Locator, Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly signInButton: Locator;
  readonly searchInputField: Locator;
  readonly searchButton: Locator;

  constructor(page: Page) {
    this.page = page;
  }

  //Add action functions here for home page
}

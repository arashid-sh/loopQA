import { Locator, Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly signInButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signInButton = page.locator('span:has-text("Sign In")');
  }

  async clickSignInButton(): Promise<void> {
    await this.signInButton.click();
  }
}

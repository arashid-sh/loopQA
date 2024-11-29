import { Locator, Page } from '@playwright/test';

export class SignInPage {
  readonly page: Page;

  readonly emailInputField: Locator;
  readonly passwordInputField: Locator;
  readonly loginButton: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInputField = page.getByLabel('Email address');
    this.passwordInputField = page.getByLabel('Password', { exact: true });
    this.loginButton = page.getByRole('button', { name: 'Log in' });
    this.continueButton = page.getByRole('button', { name: 'Continue', exact: true });
  }

  /**
   * Function enters the email and password on the sign in page and clicks
   * on the SIGN IN button
   * @param email: the accounts email address
   * @param password: the accounts password
   */
  async loginUser(email: string, password: string): Promise<void> {
    await this.emailInputField.fill(email);
    await this.continueButton.click();
    await this.passwordInputField.fill(password);
    await this.loginButton.click();
  }
}

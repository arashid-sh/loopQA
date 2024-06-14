import { Locator, Page } from '@playwright/test';

export class SignInPage {
  readonly page: Page;

  readonly emailInputField: Locator;
  readonly passwordInputField: Locator;
  readonly signInButton: Locator;
  readonly continueButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly returnToSignInLink: Locator;
  readonly forgotPasswordSendButton: Locator;
  readonly tryAgainLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInputField = page.locator('#email');
    this.passwordInputField = page.locator('#password');
    this.signInButton = page.getByTestId('LoginFormButton');
    this.continueButton = page.getByTestId('LandingFormButton');
    this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot or need a password?' });
    this.returnToSignInLink = page.getByRole('link', { name: 'Return to Sign In' });
    this.forgotPasswordSendButton = page.getByRole('button', { name: 'SEND' });
    this.tryAgainLink = page.getByRole('link', { name: 'Try again' });
  }

  /**
   * Function enters the email and password on the sign in page and clicks
   * on the SIGN IN button
   * @param email: the accounts email address
   * @param password: the accounts password
   */
  async loginUser(email: string, password: string): Promise<void> {
    await this.emailInputField.waitFor({ timeout: 30000 });
    await this.emailInputField.fill(email);
    await this.passwordInputField.fill(password);
    await this.signInButton.click();
  }
}

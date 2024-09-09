import { expect, test } from '../../src/lib/fixture';
import { config } from 'dotenv';

config();

test.describe('Sign in', { tag: '@faststore' }, () => {
  test.describe.configure({ timeout: 300000 });
  test.beforeEach(async ({ page, navBar }, testInfo) => {
    // Changing time out for these tests as they run longer on safari webkit on CI.
    testInfo.setTimeout(testInfo.timeout + 60000);
    await page.goto('/');
    await navBar.clickSignInButton();
  });

  test('validate user can login successfully', async ({ page, signInPage }) => {
    if (await signInPage.passwordInputField.isVisible()) {
      await signInPage.loginUser(process.env.EMAIL!, process.env.PASSWORD!);
      await expect(page).toHaveTitle(/.*FastStore.*/);
    }
  });

  test('verify error message is shown when invalid password is used', async ({ page, signInPage }) => {
    if (await signInPage.passwordInputField.isVisible()) {
      await signInPage.loginUser(process.env.EMAIL!, 'test1234!0980');
      expect(await page.getByTestId('ErrorContainer').textContent()).toContain(
        'The email or password you entered did not match our records. Please try again.',
      );
    }
  });

  const config = [
    { email: '', error: 'Email is a required field' },
    { email: '2#$@#$2', error: 'Please enter a valid email address' },
  ];
  for (const data of config) {
    test(`verify error message when ${data.email} email address is used`, async ({ page, signInPage }) => {
      if (await signInPage.passwordInputField.isVisible()) {
        await signInPage.emailInputField.fill(data.email);
        await signInPage.signInButton.click();
        await expect(page.getByText(data.error)).toBeVisible();
      }
    });
  }

  test('verify error message when empty password is used', async ({ page, signInPage }) => {
    if (await signInPage.passwordInputField.isVisible()) {
      await signInPage.emailInputField.fill(process.env.EMAIL!);
      await signInPage.emailInputField.fill('');
      await signInPage.signInButton.click();
      await expect(page.getByText('Password is a required field')).toBeVisible();
    }
  });

  test('verify clicking "Forgot Password" link redirects the user to Forgot Password page', async ({ page, signInPage }) => {
    if (await signInPage.passwordInputField.isVisible()) {
      await signInPage.emailInputField.fill(process.env.EMAIL!);
      await signInPage.forgotPasswordLink.click();
      await expect(page).toHaveURL(/forgot-password/);
    }
  });

  test('verify user can navigate back to login page from forgot password page', async ({ page, signInPage }) => {
    if (await signInPage.passwordInputField.isVisible()) {
      await signInPage.emailInputField.fill(process.env.EMAIL!);
      await signInPage.forgotPasswordLink.click();
      await signInPage.returnToSignInLink.click();
      await expect(page).toHaveURL(/login/);
    }
  });

  test('Verify correct message displays on entering the email address on Forgot Password page', async ({ page, signInPage }) => {
    if (await signInPage.passwordInputField.isVisible()) {
      await signInPage.forgotPasswordLink.click();
      await signInPage.emailInputField.fill(process.env.EMAIL!);
      await signInPage.forgotPasswordSendButton.click();
      await expect(page.getByRole('heading', { name: 'Check Your Email' })).toBeVisible();
      await expect(page.getByText('If an account with this email')).toBeVisible();
    }
  });

  test('Verify user is taken back to Forgot Password page on clicking Try Again link', async ({ signInPage }) => {
    if (await signInPage.passwordInputField.isVisible()) {
      await signInPage.forgotPasswordLink.click();
      await signInPage.emailInputField.fill(process.env.EMAIL!);
      await signInPage.forgotPasswordSendButton.click();
      await signInPage.tryAgainLink.click();
      await expect(signInPage.emailInputField).toBeVisible();
    }
  });
});

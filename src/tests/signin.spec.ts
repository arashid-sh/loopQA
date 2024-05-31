import { expect, test } from '../../src/lib/fixture';
import { config } from 'dotenv';

config();

test.describe('sign in', () => {
  test.beforeEach(async ({ page, navBar }, testInfo) => {
    // Changing time out for these tests as they run longer on safari webkit on CI.
    testInfo.setTimeout(testInfo.timeout + 60000);
    await page.goto('/');
    await navBar.clickSignInButton();
  });

  test('validate user can login successfully @MH @SMOKE', async ({ page, signInPage }) => {
    await signInPage.loginUser(process.env.EMAIL!, process.env.PASSWORD!);
    await expect(page).toHaveTitle("Home | Men's Health Shop");
  });

  test('verify error message is shown when invalid password is used', async ({ page, signInPage }) => {
    await signInPage.loginUser(process.env.EMAIL!, 'test1234!0980');
    expect(await page.getByTestId('ErrorContainer').textContent()).toContain('The email or password you entered did not match our records. Please try again.');
  });

  const config = [
    { email: '', error: 'Email is a required field' },
    { email: '2#$@#$2', error: 'Please enter a valid email address' },
  ];
  for (const data of config) {
    test(`verify error message when ${data.email} email address is used`, async ({ page, signInPage }) => {
      await signInPage.emailInputField.fill(data.email);
      await signInPage.continueButton.click();
      await expect(page.getByText(data.error)).toBeVisible();
    });
  }

  test('verify error message when empty password is used', async ({ page, signInPage }) => {
    await signInPage.emailInputField.fill(process.env.EMAIL!);
    await signInPage.continueButton.click();
    await signInPage.emailInputField.fill('');
    await signInPage.signInButton.click();
    await expect(page.getByText('Password is a required field')).toBeVisible();
  });

  test('verify clicking "Forgot Password" link redirects the user to Forgot Password page', async ({ page, signInPage }) => {
    await signInPage.emailInputField.fill(process.env.EMAIL!);
    await signInPage.continueButton.click();
    await signInPage.forgotPasswordLink.click();
    await expect(page).toHaveURL(/forgot-password/);
  });

  test('verify user can navigate back to login page from forgot password page', async ({ page, signInPage }) => {
    await signInPage.emailInputField.fill(process.env.EMAIL!);
    await signInPage.continueButton.click();
    await signInPage.forgotPasswordLink.click();
    await signInPage.returnToSignInLink.click();
    await expect(page).toHaveURL(/login/);
  });
});
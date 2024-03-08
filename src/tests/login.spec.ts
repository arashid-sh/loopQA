import { expect, test } from '../lib/fixture';
import { config } from 'dotenv';

config();

test.describe('login', () => {
  test('validate user can login successfully', async ({ page, homePage, signInPage }) => {
    await page.goto('/');
    await homePage.clickSignInButton();
    await signInPage.loginUser(process.env.EMAIL!, process.env.PASSWORD!);
    await expect(page).toHaveTitle('[QA] Home | QA Hearst');
  });
});

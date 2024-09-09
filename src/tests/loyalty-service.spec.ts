import { expect, test } from '../lib/fixture';
import { config } from 'dotenv';

config();
test.describe('Loyalty Service', { tag: '@loyaltyService' }, () => {
  test.describe.configure({ timeout: 300000 });
  test('verify random OTP code displays an error message ECMP-4252', async ({ page, navBar, productListPage, productDetailsPage }) => {
    await page.goto('/');
    const productName = 'sephora';
    await navBar.searchForProduct(productName);
    await page.locator('[data-testid="product-gallery"] [data-testid="product-link"]').first().waitFor();
    await productListPage.firstProductInPlp.click();
    await productDetailsPage.linkYourAccount.click();
    await productDetailsPage.loyaltyEmailField.fill('affan.rashid@hearst.com');
    await productDetailsPage.loyaltyContinueButton.click();
    await productDetailsPage.loyaltyVerificationCodeField.waitFor();
    await productDetailsPage.loyaltyVerificationCodeField.pressSequentially('12345');
    await page.waitForTimeout(1000);
    await productDetailsPage.loyaltyContinueButton.click();
    await expect(page.getByText('Something went wrong. Please')).toBeVisible();
  });
});

import { expect, test } from '../lib/fixture';
import { config } from 'dotenv';

config();
test.describe('Loyalty Service', { tag: '@loyaltyService' }, () => {
  test.describe.configure({ timeout: 600000 });
  test('verify random OTP code displays an error message ECMP-4252', async ({ page, navBar, productListPage, productDetailsPage }) => {
    await page.goto('/');
    const productName = 'sephora';
    await navBar.searchForProduct(productName);
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

  test('verify user can successfully link their sephora account, loyalty_service cookie is created, and successfully unlink (via api) when logged out happy path ECMP-4245 ECMP-4247', async ({
    page,
    navBar,
    productListPage,
    productDetailsPage,
    emailIntegrationService,
    loyaltyService,
  }) => {
    const productName = 'sephora';
    const emailAddress = '0apau@yyue1jau.mailosaur.net';
    await page.goto('/');
    await navBar.searchForProduct(productName);
    await productListPage.firstProductInPlp.click();

    await test.step('linking loyalty account', async () => {
      await productDetailsPage.linkYourAccount.click();
      await productDetailsPage.loyaltyEmailField.fill(emailAddress);
      await productDetailsPage.loyaltyContinueButton.click();
    });

    // Get message ID and verfication code from the email. Message ID will be used to delete the message from mailosaur down below to clean up the test
    const { id, code } = (await emailIntegrationService.getEmailMessage(emailAddress))!;

    await test.step('getting verification code and entering it into the flow', async () => {
      await productDetailsPage.loyaltyVerificationCodeField.waitFor();
      await productDetailsPage.loyaltyVerificationCodeField.pressSequentially(code![0].value!);
      await page.waitForTimeout(1000);
      await productDetailsPage.loyaltyContinueButton.click();
    });

    await expect
      .soft(
        page.getByText(
          'Thank you for being a Beauty Insider! Your account is linked to Sephora. You will earn Beauty Insider points for any Sephora products you purchase today.',
        ),
      )
      .toBeVisible();

    // Get cookie and verify loyalty service cookie exists.
    const cookies = await page.context().cookies();
    await expect(cookies.find((cookie) => cookie.name === 'loyalty_service')).toBeDefined();

    // By default mailosaur gets messages within the last hour. We need to clean up by deleting our email so another test doesn't get the wrong verification code.
    await emailIntegrationService.deleteMessage(id!);

    // unlinking our account using api
    await loyaltyService.unlinkLoyaltyAccount(emailAddress, 5, 'harpersbazaarqa');
  });
});

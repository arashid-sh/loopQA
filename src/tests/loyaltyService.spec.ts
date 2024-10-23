import { expect, test } from '../lib/fixture';
import { config } from 'dotenv';

config();

const successfulLinkMessage =
  'Thank you for being a Beauty Insider! Your account is linked to Sephora. You will earn Beauty Insider points for any Sephora products you purchase today.';
test.describe('Loyalty Service', { tag: ['@faststore, @loyaltyService'] }, () => {
  test.describe.configure({ timeout: 600000, mode: 'serial' });

  test.beforeEach(async ({ page, navBar, productListPage }) => {
    await page.goto('https://qa.harpersbazaar.ecmapps.com/');
    const productName = process.env.PRODUCT ?? 'undefined';
    await navBar.searchForProduct(productName);
    await productListPage.selectNthProductFromList(0);
  });

  test.afterEach(async ({ emailIntegrationService }) => {
    await emailIntegrationService.deleteAllMessages();
  });

  test('verify random OTP code displays an error message ECMP-4252', async ({ browserName, page, productDetailsPage }) => {
    test.slow(browserName === 'webkit', 'This feature is slow in Safari');
    await productDetailsPage.linkYourAccount.click();
    await productDetailsPage.loyaltyEmailField.fill('affan.rashid@hearst.com');
    await productDetailsPage.loyaltyContinueButton.click();
    await productDetailsPage.loyaltyVerificationCodeField.waitFor();
    await productDetailsPage.loyaltyVerificationCodeField.pressSequentially('12345');
    await page.waitForTimeout(1000);
    await productDetailsPage.loyaltyContinueButton.click();
    await expect(page.getByText('Something went wrong. Please')).toBeVisible();
  });

  test('verify that a user with sephora and hearst/vtex account, can link, loyalty_service cookie is created, and successfully unlink (via api) when logged out happy path ECMP-4245 ECMP-4247', async ({
    browserName,
    page,
    productListPage,
    productDetailsPage,
    emailIntegrationService,
  }) => {
    test.slow(browserName === 'webkit', 'This feature is slow in Safari');
    const emailAddress = '0apau@yyue1jau.mailosaur.net'; //This email has been registered with sephora staging

    await test.step('linking loyalty account', async () => {
      await productDetailsPage.linkYourAccount.click();
      await productDetailsPage.loyaltyEmailField.fill(emailAddress);
      await productDetailsPage.loyaltyContinueButton.click();
    });

    // Get message ID and verfication code from the email. Message ID will be used to delete the message from mailosaur down below to clean up the test
    const { id, code } = (await emailIntegrationService.getEmailMessage(emailAddress))!;

    await test.step('getting verification code and entering it into the flow and verify cookie is created', async () => {
      await productDetailsPage.loyaltyVerificationCodeField.waitFor();
      await productDetailsPage.loyaltyVerificationCodeField.pressSequentially(code![0].value!);
      await page.waitForTimeout(1000);
      await productDetailsPage.loyaltyContinueButton.click();
      await expect.soft(page.getByText(successfulLinkMessage)).toBeVisible();

      // Get cookie and verify loyalty service cookie exists.
      const cookies = await page.context().cookies();
      expect(cookies.find((cookie) => cookie.name === 'loyalty_service')).toBeDefined();
    });

    await test.step('go to another product and verify account is still linked', async () => {
      await page.goBack();
      await productListPage.selectNthProductFromList(1);
      await expect.soft(page.getByText(successfulLinkMessage)).toBeVisible();
    });

    // unlinking the account and verifying cookie is removed
    await test.step('unlink the account and verify cookie is removed', async () => {
      await productDetailsPage.unlinkAccountLink.click();
      await productDetailsPage.loyaltyEmailField.fill(emailAddress);
      await productDetailsPage.loyaltyContinueButton.click();
      // Get cookie and verify loyalty service cookie doest NOT exists.
      const cookies = await page.context().cookies();
      expect(cookies.find((cookie) => cookie.name === 'loyalty_service')).toBeUndefined();
    });

    // By default mailosaur gets messages within the last hour. We need to clean up by deleting our email so another test doesn't get the wrong verification code.
    await emailIntegrationService.deleteMessage(id!);
  });

  test('Verify that a user with sephora account and [no] hearst/vtex account can link ECMP-4243', async ({
    browserName,
    page,
    productDetailsPage,
    emailIntegrationService,
    loyaltyService,
  }) => {
    test.slow(browserName === 'webkit', 'This feature is slow in Safari');
    const emailAddress = await emailIntegrationService.createNewEmailAddress();
    await test.step('registering a sephora user via /sephora/register api', async () => {
      await loyaltyService.registerSephoraAccount(emailAddress, '5', 'harpersbazaarqa');
      // delete the welcome message from sephora so when we look for the verification code email, it'll be easier.
      await emailIntegrationService.deleteMessage((await emailIntegrationService.getEmailMessage(emailAddress)).id!);
    });

    await test.step('linking loyalty account', async () => {
      await productDetailsPage.linkYourAccount.click();
      await productDetailsPage.loyaltyEmailField.fill(emailAddress);
      await productDetailsPage.loyaltyContinueButton.click();
      await page.waitForTimeout(5000);
    });

    const allMessages = await emailIntegrationService.getAllMessagesFor(emailAddress);
    const verificationCode = await emailIntegrationService.getVerificationCodeFromListOfMessages(allMessages);

    await test.step('getting verification code and entering it into the flow', async () => {
      await productDetailsPage.loyaltyVerificationCodeField.waitFor();
      await productDetailsPage.loyaltyVerificationCodeField.pressSequentially(verificationCode!);
      await page.waitForTimeout(1000);
      await productDetailsPage.loyaltyContinueButton.click();
      await expect.soft(page.getByText(successfulLinkMessage)).toBeVisible();
    });

    // Get cookie and verify loyalty service cookie exists.
    const cookies = await page.context().cookies();
    expect(cookies.find((cookie) => cookie.name === 'loyalty_service')).toBeDefined();

    // By default mailosaur gets messages within the last hour. We need to clean up by deleting our email so another test doesn't get the wrong verification code.
    await emailIntegrationService.deleteAllMessages();

    // unlinking our account using api
    await loyaltyService.unlinkLoyaltyAccount(emailAddress, '5', 'harpersbazaarqa');
  });
});

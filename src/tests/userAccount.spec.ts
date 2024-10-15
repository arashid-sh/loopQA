import { expect, test } from '../../src/lib/fixture';
import { config } from 'dotenv';
import { faker } from '@faker-js/faker';

config();

test.describe('User Account', { tag: '@faststore' }, () => {
  test.describe.configure({ timeout: 300000 });

  test.beforeEach(async ({ page, navBar, signInPage }, testInfo) => {
    // Changing time out for these tests as they run longer on safari webkit on CI.
    testInfo.setTimeout(testInfo.timeout + 60000);
    await page.goto('/');
    await navBar.clickSignInButton();
    await signInPage.loginUser(process.env.EMAIL!, process.env.PASSWORD!);
    await navBar.myAccountButton.click();
  });

  test('validate user can update profile', async ({ page, accountPage }) => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const phoneNumber = '(805) 865 4781';
    const email = faker.internet.email();
    await accountPage.profileLink.click();
    await accountPage.editButton.click();
    await accountPage.editProfile(firstName, lastName, phoneNumber, email);
    await accountPage.saveButton.click();
    await expect(page.getByText(firstName, { exact: true })).toBeVisible();
    await expect(page.getByText(lastName, { exact: true })).toBeVisible();
    await expect(page.getByText(phoneNumber, { exact: true })).toBeVisible();
    //await expect(page.getByText(email, { exact: true })).toBeVisible();
  });

  test('validate user can add addresses', async ({ page, accountPage, userAddress }) => {
    const { zip, addressLine1 } = await userAddress.address();
    await accountPage.addressesLink.click();
    await accountPage.addAddressButton.click();
    await accountPage.zipCodeInputField.fill(zip ? zip : 'undefined');
    await accountPage.addressLine1.fill(addressLine1 ? addressLine1 : 'undefined');
    await accountPage.recipientInputField.fill('Test Name');
    await accountPage.addAddressButton.click();
    await expect(page.getByText(addressLine1!)).toBeVisible();
    await expect(page.getByText(zip!)).toBeVisible();
    // Clean up. Addresses section can have multiple addresses. Clicking on the Address's 'Edit' button that was just created
    await page.locator('span.street', { hasText: '300 W 57th St' }).locator('xpath=ancestor::article//footer//button').click();
    await accountPage.deleteAddressButton.click();
  });

  test('validate user can edit addresses', async ({ page, accountPage }) => {
    const addressLine1 = '1234 test street';
    const randomAptNumber = Math.floor(Math.random() * 900) + 100; // Generates a random number between 100 and 999
    const addressWithApt = `${addressLine1} #${randomAptNumber}`;
    await accountPage.addressesLink.click();
    await accountPage.editButton.click();
    await accountPage.editButtonNextToAddress.click();
    await accountPage.addressLine1.clear();
    await accountPage.addressLine1.focus();
    await accountPage.addressLine1.pressSequentially(addressWithApt);
    await accountPage.saveAddressButton.click();
    await expect(page.getByText(addressWithApt!)).toBeVisible();
  });
});

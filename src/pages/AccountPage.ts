import { Locator, Page } from '@playwright/test';

export class AccountPage {
  readonly addressesLink: Locator;
  readonly addAddressButton: Locator;
  readonly addressLine1: Locator;
  readonly creditCardsLink: Locator;
  readonly deleteAddressButton: Locator;
  readonly editButton: Locator;
  readonly editButtonNextToAddress;
  readonly emailField: Locator;
  readonly firstNameField: Locator;
  readonly genderDropDown: Locator;
  readonly lastNameField: Locator;
  readonly logout: Locator;
  readonly loyaltyProgramLink: Locator;
  readonly page: Page;
  readonly phoneNumberField: Locator;
  readonly profileLink: Locator;
  readonly recipientInputField: Locator;
  readonly saveButton: Locator;
  readonly saveAddressButton: Locator;
  readonly zipCodeInputField: Locator;
  readonly unlinkYourAccountButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.creditCardsLink = page.getByRole('link', { name: 'Credit cards' });

    this.logout = page.getByText('Logout');
    this.editButton = page.getByRole('button', { name: 'Edit' });
    // Profile
    this.profileLink = page.getByRole('link', { name: 'Profile' });
    this.firstNameField = page.getByLabel('First name');
    this.lastNameField = page.getByLabel('Last name');
    this.emailField = page.getByLabel('Email');
    this.phoneNumberField = page.getByLabel('Phone number');
    this.genderDropDown = page.getByLabel('GenderOptionalOptionalMaleFemale');
    // Addresses
    this.addressesLink = page.getByRole('link', { name: 'Addresses' });
    this.addAddressButton = page.getByRole('button', { name: 'Add address' });
    this.zipCodeInputField = page.getByLabel('ZIP');
    this.addressLine1 = page.getByLabel('Address line 1');
    this.recipientInputField = page.getByLabel('Recipient');
    this.deleteAddressButton = page.getByRole('button', { name: 'Delete address' });
    this.saveAddressButton = page.getByRole('button', { name: 'Save address' });
    this.editButtonNextToAddress = page.getByText('Edit', { exact: true });
    // Loyalty Program
    this.loyaltyProgramLink = page.getByRole('link', { name: 'Loyalty Program' });
    this.unlinkYourAccountButton = page.getByRole('button', { name: 'Unlink Your Account' });

    this.saveButton = page.getByRole('button', { name: 'Save Changes' });
  }

  async editProfile(firstName: string, lastName: string, phoneNumber: string, email: string): Promise<void> {
    await this.firstNameField.fill(firstName);
    await this.lastNameField.fill(lastName);
    await this.phoneNumberField.fill(phoneNumber);
    await this.emailField.fill(email);
  }
}

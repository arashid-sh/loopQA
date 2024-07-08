import { faker } from '@faker-js/faker';
import { Locator, Page } from '@playwright/test';
import { CreditCard } from '../../types/creditCard';

export class Cart {
  readonly page: Page;
  readonly checkOutButton: Locator;
  readonly proceedToCheckoutButton: Locator;
  readonly emailAddressPreFillInputField: Locator;
  readonly emailAddressInputField: Locator;
  readonly fullNameInputField: Locator;
  readonly phoneNumberInputField: Locator;
  readonly recipientNameInputField: Locator;

  readonly goToShippingButton: Locator;
  readonly zipCodeInputField: Locator;
  readonly addressInputField: Locator;
  readonly deliveryRecipientInputField: Locator;
  readonly goToPaymentButton: Locator;
  readonly addressCityInputField: Locator;
  readonly cardNumberField: Locator;
  readonly cardNameField: Locator;
  readonly cardExpField: Locator;
  readonly cvvField: Locator;
  readonly buyNowButton: Locator;
  readonly paymentCreditCardButton: Locator;
  readonly cartQuantitySelector: Locator;
  readonly removeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkOutButton = page.getByTestId('fs-cart-sidebar').getByLabel('Shopping Cart');
    this.proceedToCheckoutButton = page.getByRole('button', { name: 'PROCEED TO CHECKOUT' });
    // Contact info field locators
    this.emailAddressInputField = page.locator('#email');
    this.fullNameInputField = page.locator('#fullName');
    this.phoneNumberInputField = page.locator('#phoneNumber');
    // Shipping info field locators
    this.recipientNameInputField = page.locator('#receiverName');
    this.addressInputField = page.locator('#street');
    this.addressCityInputField = page.locator('#city');
    this.zipCodeInputField = page.locator('#postalCode');
    this.goToShippingButton = page.locator('button', { hasText: 'Go to shipping' });
    // Credit card field locators
    this.goToPaymentButton = page.getByRole('button', { name: 'Go to payment' });
    this.paymentCreditCardButton = page.getByRole('button', { name: 'Credit card Amex, Visa,' });
    this.cardNumberField = page.locator('#cardNumber');
    this.cardNameField = page.locator('#holderName');
    this.cardExpField = page.locator('#expirationDate');
    this.cvvField = page.locator('#securityCode');
    this.buyNowButton = page.getByRole('button', { name: 'BUY NOW' });
    this.cartQuantitySelector = page.locator('#quantity-selector-input');
    this.removeButton = page.getByTestId('remove-button');
  }

  /**
   * Function clicks the user through the Cart Preview modal to the checkout page
   */
  async proceedToCheckout(): Promise<void> {
    await this.checkOutButton.click();
    await this.proceedToCheckoutButton.first().click();
  }

  /**
   * Function clicks on the sign in button on home page.
   */
  async addContactInfo(): Promise<void> {
    await this.emailAddressInputField.fill(faker.internet.email());
    await this.fullNameInputField.fill(faker.person.firstName() + ' ' + 'test');
    // Note as of right now faker.phone.number() generates random phone numbers, sometimes with extensions
    // This a fix in the works https://github.com/faker-js/faker/issues/1542 that should fix this.
    await this.phoneNumberInputField.fill('818-654-8164');
  }

  /**
   * Function fills out the shipping info.
   */
  async addShippingInfo(): Promise<void> {
    await this.addressInputField.fill('1777 Ala Moana Blvd, Apt 601');
    await this.page.getByLabel('State').selectOption('HI');
    await this.addressCityInputField.fill('Honolulu');
    await this.zipCodeInputField.fill('96815');
  }

  /**
   * This function takes the credit card provided and fills the appropriate fields in fast checkout
   * @param creditCard : the credit card you randomly send by calling await creditCards.createCreditCard() function
   *
   * @example
   * await cart.addPaymentInfo(await creditCards.createCreditCard());
   */
  async addPaymentInfo(creditCard: CreditCard): Promise<void> {
    await this.cardNumberField.pressSequentially(creditCard.number, { delay: 500 });
    await this.cardNameField.fill(faker.person.firstName() + ' ' + faker.person.lastName());
    await this.cardExpField.fill(creditCard.expDate);
    await this.cvvField.fill(creditCard.securityCode);
  }

  /**
   * Function clicks on the Buy Now button in checkout
   */
  async clickBuyNowButton(): Promise<void> {
    await this.buyNowButton.click();
  }
}

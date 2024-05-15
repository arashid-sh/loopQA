import { faker } from '@faker-js/faker';
import { Locator, Page } from '@playwright/test';
import { CreditCard } from '../../types/creditCard';

export class Cart {
  readonly page: Page;
  readonly checkOutButton: Locator;
  readonly proceedToCheckoutButton: Locator;
  readonly emailAddressPreFillInputField: Locator;
  readonly emailAddressInputField: Locator;
  readonly firstNameInputField: Locator;
  readonly lastNameInputField: Locator;
  readonly phoneNumberInputField: Locator;
  readonly continueToShippingButton: Locator;
  readonly postalCodeInputField: Locator;
  readonly streetAddressInputField: Locator;
  readonly deliveryRecipientInputField: Locator;
  readonly continueToPaymentButton: Locator;
  readonly addressCityInputField: Locator;
  readonly addressZipInputFIeld: Locator;
  readonly cardNumberField: Locator;
  readonly cardNameField: Locator;
  readonly cardExpDateField: Locator;
  readonly cardExpYearField: Locator;
  readonly cvvField: Locator;
  readonly buyNowButton: Locator;
  readonly paymentCreditCardButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkOutButton = page.getByTestId('fs-cart-sidebar').getByLabel('Shopping Cart');
    this.proceedToCheckoutButton = page.locator('#cart-to-orderform');
    this.emailAddressInputField = page.locator('#client-email');
    this.firstNameInputField = page.locator('#client-first-name');
    this.lastNameInputField = page.locator('#client-last-name');
    this.phoneNumberInputField = page.getByPlaceholder('999-9999');
    this.continueToShippingButton = page.locator('#go-to-shipping');
    this.emailAddressPreFillInputField = page.locator('#client-pre-email');
    // Shipping info field locators
    this.postalCodeInputField = page.locator('#shipping-data #ship-postalCode');
    this.streetAddressInputField = page.locator('#shipping-data #ship-street');
    this.deliveryRecipientInputField = page.locator('#shipping-data #ship-receiverName');
    this.continueToPaymentButton = page.locator('#shipping-data #btn-go-to-payment');
    this.addressCityInputField = page.getByLabel('City');
    this.addressZipInputFIeld = page.locator('#shipping-data #ship-state');
    // Credit card field locators
    this.cardNumberField = page.frameLocator('#iframe-placeholder-creditCardPaymentGroup iframe').getByTestId('creditCardpayment-card-0Number');
    this.cardNameField = page.frameLocator('#iframe-placeholder-creditCardPaymentGroup iframe').getByLabel('Name on card');
    this.cardExpDateField = page.frameLocator('#iframe-placeholder-creditCardPaymentGroup iframe').getByLabel('Expiry date');
    this.cardExpYearField = page.frameLocator('#iframe-placeholder-creditCardPaymentGroup iframe').locator('#creditCardpayment-card-0Year');
    this.cvvField = page.frameLocator('#iframe-placeholder-creditCardPaymentGroup iframe').getByLabel('CVV');
    this.paymentCreditCardButton = page.getByRole('link', { name: 'Credit card' });

    this.buyNowButton = page.getByRole('button', { name: 'Buy now', exact: true });
  }

  /**
   * Function clicks the user through the Cart Preview modal to the checkout page
   */
  async proceedToCheckout(): Promise<void> {
    await this.checkOutButton.click();
    await this.proceedToCheckoutButton.first().click();
    await this.emailAddressPreFillInputField.fill(faker.internet.email());
    await this.page.locator('#btn-client-pre-email').click();
  }

  /**
   * Function clicks on the sign in button on home page.
   */
  async addContactInfo(): Promise<void> {
    await this.firstNameInputField.click();
    await this.firstNameInputField.pressSequentially(faker.person.firstName(), { delay: 100 });
    await this.lastNameInputField.pressSequentially(faker.person.lastName(), { delay: 100 });
    // Note as of right now faker.phone.number() generates random phone numbers, sometimes with extensions
    // This a fix in the works https://github.com/faker-js/faker/issues/1542 that should fix this.
    await this.phoneNumberInputField.waitFor({ timeout: 1000 });
    await this.phoneNumberInputField.pressSequentially('818-654-8164', { delay: 100 });
    await this.continueToShippingButton.click();
  }

  /**
   * Function fills out the shipping info.
   */
  async addShippingInfo(): Promise<void> {
    await this.postalCodeInputField.pressSequentially('96815', { delay: 100 });
    // Shipping frame loads again once you input a zip code. Tried to wait for visible elements, classes but
    // a hard wait was the last solution that worked consistently
    await this.page.waitForTimeout(5000);
    await this.streetAddressInputField.pressSequentially('1777 Ala Moana Blvd, Apt 601', { delay: 100 });
    await this.deliveryRecipientInputField.pressSequentially(faker.person.fullName());
    await this.continueToPaymentButton.click();
  }

  async addPaymentInfo(creditCard: CreditCard): Promise<void> {
    await this.paymentCreditCardButton.click();
    // Switch case will click on the correct credit card type (visa, discover, etc) based on which card is being used.
    switch (true) {
      case creditCard.type.toLocaleLowerCase().includes('visa'):
        await this.page.locator('span', { hasText: 'Visa' }).click;
        break;
      case creditCard.type.toLocaleLowerCase().includes('discover'):
        await this.page.locator('span', { hasText: 'Discover' }).click;
        break;
      case creditCard.type.toLocaleLowerCase().includes('AMEX'):
        await this.page.locator('span', { hasText: 'American Express' }).click;
        break;
      case creditCard.type.toLocaleLowerCase().includes('MC'):
        await this.page.locator('span', { hasText: 'Mastercard' }).click;
        break;
    }

    await this.cardNumberField.fill(creditCard.number);
    await this.cardNameField.fill(faker.person.fullName());
    await this.cardExpDateField.selectOption(creditCard.expMo);
    await this.cardExpYearField.selectOption(creditCard.expYr);
    await this.cvvField.fill(creditCard.securityCode);
    await this.page.waitForTimeout(3000);
  }

  /**
   * Function clicks on the Buy Now button in checkout
   */
  async clickBuyNowButton(): Promise<void> {
    await this.buyNowButton.click();
  }
}

import { Locator, Page } from '@playwright/test';

export class MiniCart {
  readonly page: Page;
  readonly keepShoppingButton: Locator;
  readonly removeButton: Locator;
  readonly decreaseQuantityButton: Locator;
  readonly increaseQuantityButton: Locator;
  readonly viewCartAndCheckoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.keepShoppingButton = page.locator('button[data-fs-keep-shopping-button]');
    this.removeButton = page.getByTestId('remove-button');
    this.decreaseQuantityButton = page.getByTestId('quantity-selector-left-button');
    this.increaseQuantityButton = page.getByTestId('quantity-selector-right-button');
    this.viewCartAndCheckoutButton = page.getByTestId('go-to-checkout-button');
    this.continueShoppingButton = page.locator('button', { hasText: 'CONTINUE SHOPPING' });
  }
}

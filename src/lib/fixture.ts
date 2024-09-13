import { test as base } from '@playwright/test';
import { HomePage } from '../pages/homePage';
import { SignInPage } from '../pages/signInPage';
import { CreditCards } from '../datafactory/creditCards';
import { NavBar } from '../pages/components/navbar';
import { ProductListPage } from '../pages/productListPage';
import { ProductDetailsPage } from '../pages/productDetailsPage';
import { Cart } from '../pages/components/cart';
import EmailIntegrationService from '../services/emailIntegrationService';
import { LoyaltyService } from '../services/loyaltyService';

type MyFixtures = {
  navBar: NavBar;
  cart: Cart;
  homePage: HomePage;
  signInPage: SignInPage;
  creditCards: CreditCards;
  productListPage: ProductListPage;
  productDetailsPage: ProductDetailsPage;
  emailIntegrationService: EmailIntegrationService;
  loyaltyService: LoyaltyService;
};

export const test = base.extend<MyFixtures>({
  navBar: async ({ page }, use) => {
    await use(new NavBar(page));
  },

  productListPage: async ({ page }, use) => {
    await use(new ProductListPage(page));
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  signInPage: async ({ page }, use) => {
    await use(new SignInPage(page));
  },

  creditCards: async ({}, use) => {
    await use(new CreditCards());
  },

  productDetailsPage: async ({ page }, use) => {
    await use(new ProductDetailsPage(page));
  },

  cart: async ({ page }, use) => {
    await use(new Cart(page));
  },

  emailIntegrationService: async ({}, use) => {
    await use(new EmailIntegrationService());
  },

  loyaltyService: async ({}, use) => {
    const loyaltyService = new LoyaltyService();
    await loyaltyService.init();
    await use(loyaltyService);
  },
});

export { expect } from '@playwright/test';

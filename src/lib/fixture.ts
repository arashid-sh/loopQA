import { test as base } from '@playwright/test';
import { HomePage } from '../pages/homePage';
import { SignInPage } from '../pages/signInPage';
import { CreditCards } from '../datafactory/creditCards';
import { NavBar } from '../pages/components/navbar';
import { ProductListPage } from '../pages/productListPage';
import { ProductDetailsPage } from '../pages/productDetailsPage';
import { Cart } from '../pages/components/cart';

type MyFixtures = {
  navBar: NavBar;
  cart: Cart;
  homePage: HomePage;
  signInPage: SignInPage;
  creditCards: CreditCards;
  productListPage: ProductListPage;
  productDetailsPage: ProductDetailsPage;
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

  creditCards: async (_, use) => {
    await use(new CreditCards());
  },

  productDetailsPage: async ({ page }, use) => {
    await use(new ProductDetailsPage(page));
  },

  cart: async ({ page }, use) => {
    await use(new Cart(page));
  },
});

export { expect } from '@playwright/test';

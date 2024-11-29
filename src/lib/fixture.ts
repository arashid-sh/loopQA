import { test as base } from '@playwright/test';
import { HomePage } from '../pages/homePage';
import { SignInPage } from '../pages/signInPage';

type MyFixtures = {
  homePage: HomePage;
  signInPage: SignInPage;
};

export const test = base.extend<MyFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  signInPage: async ({ page }, use) => {
    await use(new SignInPage(page));
  },
});

export { expect } from '@playwright/test';

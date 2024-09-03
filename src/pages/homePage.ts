import { Locator, Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly signInButton: Locator;
  readonly searchInputField: Locator;
  readonly searchButton: Locator;
  readonly productCarousel: Locator;
  readonly productCarouselSeeAllLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productCarousel = page.getByTestId('fs-carousel');
    this.productCarouselSeeAllLink = page.getByRole('link', { name: 'SEE ALL', exact: true }).first();
  }

  //Add action functions here for home page
}

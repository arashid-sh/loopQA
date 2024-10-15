import { expect, test } from '../../src/lib/fixture';
import { config } from 'dotenv';

config();
test.describe('Home page', { tag: '@faststore' }, () => {
  test.describe.configure({ timeout: 300000 });
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  [{ component: 'fs-hero' }, { component: 'fs-navbar-header' }].forEach(({ component }) => {
    test(`validate ${component} component exists`, async ({ page }) => {
      await expect(page.getByTestId(component).first()).toBeVisible();
    });
  });

  test('nav bar links navigate to the corresponding pages', { tag: '@faststore' }, async ({ browserName, page, navBar }) => {
    test.slow(browserName === 'webkit', 'This feature is slow in Safari');
    const links = await navBar.getAllNavBarCategoryLinks();
    for (const link of links) {
      const hrefValue = await link.getByTestId('data-fs-button-dropdown-link').getAttribute('href');
      await link.click();
      await expect(page).toHaveURL(hrefValue!);
      await page.goBack();
    }
  });
});

import { expect, test } from '../../src/lib/fixture';
import { config } from 'dotenv';

config();
test.describe('home page', { tag: '@faststore' }, () => {
  test.describe.configure({ timeout: 300000 });
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  [{ component: 'fs-hero' }, { component: 'fs-navbar-header' }].forEach(({ component }) => {
    test(`validate ${component} component exists`, async ({ page }) => {
      await expect(page.getByTestId(component).first()).toBeVisible();
    });
  });

  test('nav bar links navigate to the corresponding pages', { tag: '@faststore' }, async ({ page }) => {
    const links = await page.getByTestId('fs-navbar-links-list-item').all();
    for (const link of links) {
      console.log(link);
      const hrefValue = await link.getByTestId('data-fs-button-dropdown-link').getAttribute('href');
      await link.click();
      await expect(page).toHaveURL(hrefValue!);
      await page.goBack();
    }
  });
});

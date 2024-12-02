import { config } from 'dotenv';

import { expect, test } from '../lib/fixture';

config();

test.describe('Sign in', { tag: '@loopQA' }, () => {
  //test.describe.configure({ timeout: 300000 });
  test.beforeEach(async ({ page, signInPage }, testInfo) => {
    // Changing time out for these tests as they run longer on safari webkit on CI.
    testInfo.setTimeout(testInfo.timeout + 60000);
    await page.goto('/');
    await signInPage.loginUser(process.env.EMAIL!, process.env.PASSWORD!);
    await expect(page).toHaveTitle(/.*Asana.*/);
  });

  [
    {
      project: 'Cross-functional project plan, Project',
      column: 'To do',
      item: 'Draft project brief',
      tags: ['Non-priority', 'On track'],
    },
    {
      project: 'Cross-functional project plan, Project',
      column: 'To do',
      item: 'Schedule kickoff meeting',
      tags: ['Medium', 'At risk'],
    },
    {
      project: 'Cross-functional project plan, Project',
      column: 'To do',
      item: 'Share timeline with teammates',
      tags: ['High', 'Off track'],
    },
    {
      project: 'Work Requests',
      column: 'New Requests',
      item: '[Example] Laptop setup for new hire',
      tags: ['Medium priority', 'Low effort', 'New hardware', 'Not Started'],
    },
    {
      project: 'Work Requests',
      column: 'In Progress',
      item: '[Example] Password not working',
      tags: ['Low effort', 'Low priority', 'Password reset', 'Waiting'],
    },
    {
      project: 'Work Requests',
      column: 'Completed',
      item: '[Example] New keycard for Daniela V',
      tags: ['Low effort', 'New hardware', 'High Priority', 'Done'],
    },
  ].forEach((testCase) => {
    test(`verify [${testCase.item}] is in the [${testCase.column}] column with tags: [${testCase.tags}]`, async ({
      homePage,
    }) => {
      // Click on the project
      await homePage.selectProject(`${testCase.project}`);

      // itemList will be assigned an array of all the items from the column if the column is found
      const itemList = await homePage.getItemListFromColumn(`${testCase.column}`);
      // if an array with length 0 is returned that means the column was not found and we fail the test.
      if (itemList.length === 0) {
        console.error(`[${testCase.column}] was not found on the page`);
        expect(itemList.length).toBeGreaterThan(0);
      }

      // found is being used as a flag that will be used later to fail the test if the specified item with in the column is not found.
      let found = false;
      // Iterate over the list of items and verify that the tags are present for the specified item
      for (const item of itemList) {
        if (await item.getByText(`${testCase.item}`, { exact: true }).isVisible()) {
          for (const tag of testCase.tags) {
            await expect(item.getByText(`${tag}`)).toBeVisible();
          }
          found = true;
        }
      }
      // If the item was not found within the column we fail the test.
      if (!found) {
        console.error(`[${testCase.item}] was not found in the [${testCase.column}] column`);
        expect(found).toBeTruthy();
      }
    });
  });
});

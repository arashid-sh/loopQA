import { Locator, Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Function will click on the given project and wait for the columns to load before moving forward
   * @param projectName name of the project
   */
  async selectProject(projectName: string): Promise<void> {
    await this.page.getByLabel(`${projectName}`).click();
    await this.page.locator('.CommentOnlyBoardBody-columns').waitFor();
  }

  /**
   * This function goes through all the columns on the page looking for the column name specified (e.g. 'To do')
   * and returns all the items with in the column.
   * @param columnName
   * @returns
   */
  async getItemListFromColumn(columnName: string): Promise<Locator[]> {
    // Get locators for all the columns
    const columns = await this.page.locator('.CommentOnlyBoardColumn h3').all();

    // Iterate through each column looking for the columnName specified.
    for (let i = 0; i <= columns.length; i++) {
      // If column name found, return all the items within the column
      if (await columns[i].filter({ hasText: `${columnName}` }).isVisible()) {
        return this.page
          .locator('[class="CommentOnlyBoardColumn CommentOnlyBoardBody-column"]')
          .nth(i)
          .locator('.CommentOnlyBoardColumnCardsContainer-itemList .CommentOnlyBoardColumnCardsContainer-itemContainer')
          .all();
      }
    }
    return this.page.locator('').all();
  }
}

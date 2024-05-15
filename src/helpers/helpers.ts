import { Page, expect } from '@playwright/test';
import { Locator } from 'playwright';

export async function extractPriceAsInteger(locator: Locator): Promise<number> {
  // Get the text content of the element
  const textContent = await locator.textContent();

  // Define a regular expression to match currency format like $45.00
  const currencyRegex = /\$\d+(\.\d{2})?/;

  // Match the currency format in the text content
  const matchedCurrency = textContent!.match(currencyRegex);

  if (!matchedCurrency) {
    throw new Error('No currency format found in the text content');
  }

  // Extract the matched currency format
  const priceString = matchedCurrency[0].slice(1); // Remove the dollar sign

  // Return the price as an integer
  return parseFloat(priceString); // Multiplied by 100 to convert to cents and –rounded to integer
}

import { Locator } from 'playwright';
import currency from 'currency.js';

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
  const priceString = matchedCurrency[0]; // Keep the dollar sign for currency.js

  // Use currency.js to parse the price
  const price = currency(priceString);

  // Return the price as a decimal (number)
  return price.value;
}

export async function extractNumberFromLocatorTextContent(locator: Locator): Promise<string> {
  // Get the text content of the element
  const textContent = await locator.textContent();

  // Define a regular expression to match a number in the text
  const numberRegex = /(\d{1,3}(?:,\d{3})*|\d+)(\.\d+)?/;

  // Match the number format in the text
  const matchedNumber = textContent!.match(numberRegex);

  if (!matchedNumber) {
    throw new Error('No number format found in the text content');
  }

  // Extract the matched number and remove any commas
  return matchedNumber[0].replace(/,/g, '');
}

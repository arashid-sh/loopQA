export const environments = {
  cosmopolitanqa: 'https://qa.cosmopolitan.ecmapps.com/',
  harpersbazaarprod: 'https://shop.harpersbazaar.com/',
  harpersbazaarqa: 'https://qa.harpersbazaar.ecmapps.com/',
  menshealthqa: 'https://qa.menshealth.ecmapps.com/',
  oprahqa: '',
  preventionqa: 'https://qa.prevention.ecmapps.com/',
  womenshealthqa: 'https://qa.womenshealth.ecmapps.com/',
};

/**
 * This sets the baseURL given the TEST_ENV environment variable
 * @returns `string` The correct base url from the object enviornments based on which TEST_ENV is passed in.
 */
export function setEnvironment(): string {
  try {
    return environments[process.env.TEST_ENV!];
  } catch {
    throw Error('Invalid TEST_ENV environment variable');
  }
}

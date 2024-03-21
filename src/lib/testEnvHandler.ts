export const environments = {
  whqa: '',
  mhqa: 'https://marketplace.qa.ecmapps.net/',
  whprod: '',
};

/**
 * This sets the baseURL given the TEST_ENV environment variable
 * @returns `string` The correct base url from the object enviornments based on which TEST_ENV is passed in.
 */
export function setEnvironment(): string {
  try {
    return environments[process.env.TEST_ENV!];
  } catch {
    throw Error('Invalid TEST_ENV enviornment variable');
  }
}

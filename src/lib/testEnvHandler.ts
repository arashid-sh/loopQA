export const environments = {
  whqa: '',
  mhqa: 'https://marketplace.qa.ecmapps.net/',
};

/**
 * This function should only be used in our playwright config file.
 * @returns `string` The correct base url from the object enviornments based on which TEST_ENV is passed in.
 */
export function setEnvironment(): string {
  try {
    return environments[process.env.TEST_ENV!];
  } catch {
    throw Error('Invalid TEST_ENV enviornment variable');
  }
}

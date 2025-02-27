module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:playwright/playwright-test', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2022,
  },
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-non-null-assertion': 'off',
    'playwright/prefer-lowercase-title': 'warn',
    'playwright/prefer-to-be': 'warn',
    'playwright/prefer-to-have-length': 'warn',
    'playwright/prefer-strict-equal': 'warn',
    'playwright/expect-expect': 'off',
    'playwright/no-wait-for-timeout': 'off',
    'playwright/max-nested-describe': ['warn', { max: 1 }],
    'playwright/no-restricted-matchers': [
      'error',
      {
        toBeFalsy: 'Use `toBe(false)` instead.',
        not: null,
      },
    ],
    'playwright/missing-playwright-await': ['error'],
  },
};

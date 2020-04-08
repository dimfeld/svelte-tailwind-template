module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    ecmaVersion: 2019,
    sourceType: 'module',
  },
  overrides: [
    {
      files: ['**/*.svelte'],
      parser: 'espree',
      processor: 'svelte3/svelte3',
    },
  ],
  plugins: ['@typescript-eslint/eslint-plugin', 'svelte3'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'prettier/@typescript-eslint',
  ],
  rules: {
    'no-unused-vars': ['warn', { args: 'none' }],
  },
};

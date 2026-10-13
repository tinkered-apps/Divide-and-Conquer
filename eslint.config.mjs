// ESLint's recommended rules, run by `npm test`. The app has no build step, so
// this is the only thing that reads every file before it ships.

import js from '@eslint/js';
import globals from 'globals';

// Each shared script declares one global that the page scripts loaded after it use.
const shared = { TRANSLATIONS: 'readonly', I18N: 'readonly', STORE: 'readonly', LEARNING: 'readonly', THEME: 'readonly' };

export default [
  { ignores: ['node_modules/', 'test-results/', 'playwright-report/', '.wrangler/'] },

  js.configs.recommended,
  {
    rules: {
      // An unused name in `catch (error)` and an empty `catch` block are how the app ignores a blocked localStorage.
      'no-unused-vars': ['error', { caughtErrors: 'none' }],
      'no-empty': ['error', { allowEmptyCatch: true }],
    },
  },

  {
    files: ['public/**/*.js'],
    languageOptions: { sourceType: 'script', globals: { ...globals.browser, ...shared } },
    // A top-level declaration in a classic script is its interface to the other scripts.
    rules: { 'no-unused-vars': ['error', { vars: 'local', caughtErrors: 'none' }], 'no-redeclare': ['error', { builtinGlobals: false }] },
  },
  // These four are also loaded by Node in the unit tests, so they end with a CommonJS export.
  { files: ['public/js/translations.js', 'public/js/i18n.js', 'public/js/store.js', 'public/js/learning.js'], languageOptions: { globals: globals.commonjs } },
  { files: ['public/sw.js'], languageOptions: { globals: globals.serviceworker } },

  { files: ['tests/**', '*.js'], languageOptions: { sourceType: 'commonjs', globals: globals.node } },
  // Playwright specs run in Node and hand callbacks to the page.
  { files: ['e2e/**'], languageOptions: { sourceType: 'commonjs', globals: { ...globals.node, ...globals.browser } } },
];

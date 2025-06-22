module.exports = {
  env: {
    browser: true,
    es2021: true,
    serviceworker: true,
  },
  extends: [
    'eslint:recommended',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  globals: {
    self: 'readonly',
    clients: 'readonly',
    caches: 'readonly',
    fetch: 'readonly',
  },
}; 
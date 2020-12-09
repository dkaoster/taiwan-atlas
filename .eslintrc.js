module.exports = {
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
  },
  env: {
    es6: true,
  },
  extends: ['eslint-config-airbnb-base'],
  rules: {
    'no-nested-ternary': 0,
    'import/no-extraneous-dependencies': 0,
    'no-param-reassign': 0,
  },
};

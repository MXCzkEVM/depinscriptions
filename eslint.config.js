const antfu = require('@antfu/eslint-config').default

module.exports = antfu({
  vue: false,
  typescript: true,
  react: true,
  rules: {
    'ts/no-require-imports': 'off',
    'no-console': 'off',
    'ts/consistent-type-imports': 'off',
    'react-hooks/exhaustive-deps': 'off',
  },
})

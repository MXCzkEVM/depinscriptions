import antfu from '@antfu/eslint-config'

export default antfu({
  vue: false,
  typescript: true,
  react: true,
  rules: {
    'ts/no-require-imports': 'off',
    'no-console': 'off',
    'ts/consistent-type-imports': 'off',
  },
})

import js from '@eslint/js'
import globals from 'globals'
import stylistic from '@stylistic/eslint-plugin'

export default [
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      stylistic,
    },
    rules: {
      ...js.configs.recommended.rules,
      'stylistic/semi': ['error', 'never'],
      'stylistic/brace-style': ['error', '1tbs'],
      'stylistic/arrow-parens': ['error', 'as-needed'],
      'stylistic/quote-props': ['error', 'consistent-as-needed'],
      'no-console': 'off',
      'no-underscore-dangle': ['error', { allow: ['__filename', '__dirname'] }],
    },
  },
]

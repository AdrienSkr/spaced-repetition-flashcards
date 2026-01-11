import { default as js, default as pluginJs } from '@eslint/js'
import tailwind from 'eslint-plugin-tailwindcss'
import globals from 'globals'
import { default as ts, default as tseslint } from 'typescript-eslint'

export default [
  // add eslint built-in
  js.configs.recommended,
  // add `typescript-eslint` flat config simply
  // if you would like use more another configuration,
  // see the section: https://typescript-eslint.io/getting-started#details
  ...ts.configs.recommended,
  ...tailwind.configs['flat/recommended'],
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    rules: {
      'prefer-const': 'warn',
      'no-constant-binary-expression': 'error',
    },
  },
  {
    settings: {
      tailwindcss: {
        config: './tailwind.config.js',
      },
    },
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
]

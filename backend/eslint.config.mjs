import eslint from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import promisePlugin from 'eslint-plugin-promise';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tseslint from 'typescript-eslint';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Стилевые правила в духе frontend/eslint.config.js (NestJS, без React, type-aware TS). */
export default tseslint.config(
  {
    ignores: ['eslint.config.mjs', 'dist/**'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  importPlugin.flatConfigs.recommended,
  {
    files: ['*.{js,mjs,cjs}', '**/*.{js,mjs,cjs}'],
    rules: {
      'import/no-unresolved': 'off',
    },
  },
  {
    plugins: {
      promise: promisePlugin,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        // Явный project стабильнее в монорепе, чем только projectService (IDE перестаёт терять типы из node_modules).
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      'max-len': ['error', { code: 150, ignoreUrls: true, ignoreStrings: true }],
      indent: ['error', 2],
      'comma-dangle': ['error', 'always-multiline'],
      'no-multi-spaces': ['error'],
      'no-trailing-spaces': ['error', { skipBlankLines: false, ignoreComments: false }],
      'comma-spacing': ['error'],
      'no-negated-condition': ['error'],
      'no-nested-ternary': ['error'],
      'no-whitespace-before-property': ['error'],
      'keyword-spacing': ['error', { before: true, after: true }],
      'no-multiple-empty-lines': ['error', { max: 3, maxEOF: 1, maxBOF: 0 }],

      'import/no-unresolved': 'off',
      'import/newline-after-import': ['warn', { count: 1 }],
      'import/no-duplicates': ['error'],
      'import/first': ['warn'],
      'import/no-mutable-exports': ['error'],

      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'array-bracket-spacing': ['error', 'always'],
      'object-curly-spacing': ['error', 'always'],
      'no-var': ['error'],
      'no-tabs': ['error'],
      'prefer-const': ['error', { destructuring: 'all', ignoreReadBeforeAssign: false }],
      quotes: ['error', 'single'],

      'max-depth': ['error', { max: 5 }],
      'max-params': ['error', { max: 5 }],
      'max-nested-callbacks': ['error', { max: 5 }],

      'promise/no-nesting': ['error'],
      'promise/valid-params': ['error'],
      'promise/catch-or-return': [
        'error',
        {
          allowFinally: true,
          terminationMethod: ['catch', 'asCallback'],
        },
      ],
      'promise/no-promise-in-callback': ['error'],
      'promise/no-callback-in-promise': ['off'],
      'promise/no-return-in-finally': ['error'],

      '@typescript-eslint/no-var-requires': ['error'],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
    },
  },
);

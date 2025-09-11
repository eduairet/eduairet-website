import { defineConfig, globalIgnores } from 'eslint/config';
import unusedImports from 'eslint-plugin-unused-imports';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  globalIgnores([
    '.next/**',
    'node_modules/**',
    'dist/**',
    'build/**',
    '*.generated.*',
    'src/models/types/**/*.{ts,tsx,js,jsx}',
    'src/models/enums/**/*.{ts,tsx,js,jsx}',
  ]),
  {
    ignores: [],

    extends: compat.extends('eslint:recommended', 'next', 'prettier'),

    plugins: {
      'unused-imports': unusedImports,
    },

    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    files: ['src/models/**/*.{ts,tsx,js,jsx}'],

    extends: compat.extends('eslint:recommended', 'next', 'prettier'),
  },
]);

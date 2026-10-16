import { defineConfig, globalIgnores } from 'eslint/config';
import js from '@eslint/js';
import nextConfig from 'eslint-config-next';
import prettierConfig from 'eslint-config-prettier';
import unusedImports from 'eslint-plugin-unused-imports';

const unusedVarsOptions = {
  vars: 'all',
  varsIgnorePattern: '^_',
  args: 'after-used',
  argsIgnorePattern: '^_',
};

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
  js.configs.recommended,
  ...nextConfig,
  prettierConfig,
  {
    plugins: {
      'unused-imports': unusedImports,
    },

    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'no-unused-vars': ['error', unusedVarsOptions],
    },
  },
  {
    // unused-imports wraps typescript-eslint's rule, which needs its parser since 8.71.
    files: ['**/*.{ts,tsx,mts,cts}'],
    rules: {
      'no-unused-vars': 'off',
      'unused-imports/no-unused-vars': ['error', unusedVarsOptions],
    },
  },
]);

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['__tests__/**/*.{test,spec}.{ts,tsx,js,jsx}'],
  },
});

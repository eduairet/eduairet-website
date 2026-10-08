import { expect, test } from 'vitest';
import { getDictionary } from '@/app/[locale]/dictionaries';
import { Lang } from '@/models';

test.each(['en', 'es'])('returns the %s dictionary', async (locale) => {
  expect(await getDictionary(locale as Lang)).toBeDefined();
});

test.each(['wp-login.php', '_next', '.env', 'toString'])(
  'answers %s with notFound()',
  async (locale) => {
    await expect(getDictionary(locale as Lang)).rejects.toThrow(
      'NEXT_HTTP_ERROR_FALLBACK;404'
    );
  }
);

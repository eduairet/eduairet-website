import { expect, test } from 'vitest';
import { getDictionary } from '@/app/[locale]/dictionaries';
import { locales } from '@/utils/server/localization.utils';
import { toUiContent } from '@/models';

test.each(locales)('returns the %s dictionary', async (locale) => {
  expect(await getDictionary(locale)).toBeDefined();
});

test.each(locales)('sends the %s toast copy to the client', async (locale) => {
  const { buttons, contact } = toUiContent(await getDictionary(locale));
  expect(buttons.closeToast).not.toBe('');
  expect(contact.form.success).not.toBe('');
});

test.each(['wp-login.php', '_next', '.env', 'toString'])(
  'answers %s with notFound()',
  async (locale) => {
    await expect(getDictionary(locale)).rejects.toThrow(
      'NEXT_HTTP_ERROR_FALLBACK;404'
    );
  }
);

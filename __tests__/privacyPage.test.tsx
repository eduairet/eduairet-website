import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import Privacy from '@/app/[locale]/privacy/page';
import Footer from '@/components/ui/Footer/Footer';
import { LanguageProvider } from '@/store/LanguageProvider';
import { stubResizeObserver } from './helpers/resizeObserver';
import { Dictionary, EnContent, EsContent, type Lang } from '@/models';
import {
  POSTAL_ADDRESS,
  PRIVACY_UPDATED,
  PrivacyLinks,
} from '@/utils/constants';

vi.mock('next/navigation', async (importOriginal) => ({
  ...(await importOriginal<typeof import('next/navigation')>()),
  usePathname: () => '/en',
  useRouter: () => ({ prefetch: () => {} }),
}));

afterEach(cleanup);

const dictionaries = {
  en: new Dictionary(EnContent),
  es: new Dictionary(EsContent),
};

// What the Mexican law (LFPDPPP art. 15) and GDPR art. 13 ask a notice to cover.
const REQUIRED_SECTIONS = [
  'who',
  'data',
  'purposes',
  'services',
  'storage',
  'retention',
  'cookies',
  'choices',
  'rights',
  'complaints',
  'changes',
];

const renderPrivacy = async (locale: Lang) =>
  render(await Privacy({ params: Promise.resolve({ locale }) }));

test.each([
  ['en', 'Privacy notice', 'October 15, 2026', '(opens in a new tab)'],
  [
    'es',
    'Aviso de privacidad',
    '15 de octubre de 2026',
    '(se abre en otra pestaña)',
  ],
] as const)(
  '%s renders every required section, the date and each service link',
  async (locale, title, date, newTab) => {
    const { container } = await renderPrivacy(locale);

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(title);
    const sections = [...container.querySelectorAll('section')];
    expect(sections.map((section) => section.id)).toEqual(REQUIRED_SECTIONS);
    for (const section of sections) {
      expect(within(section).getByRole('heading', { level: 2 })).toBeTruthy();
    }

    const time = container.querySelector('time');
    expect(time?.getAttribute('dateTime')).toBe(PRIVACY_UPDATED);
    expect(time?.textContent).toBe(date);

    expect(container.querySelector('#who')?.textContent).toContain(
      POSTAL_ADDRESS
    );
    const emailLinks = screen.getAllByRole('link', {
      name: 'hola@eduairet.com',
    });
    expect(emailLinks.length).toBeGreaterThan(0);
    for (const link of emailLinks)
      expect(link.getAttribute('href')).toBe('mailto:hola@eduairet.com');

    for (const [key, href] of Object.entries(PrivacyLinks)) {
      // jsdom drops the space before the hidden text; Chrome keeps it.
      const link = screen.getByRole('link', {
        name: (name) =>
          name.startsWith(dictionaries[locale].privacy.links[key]) &&
          name.endsWith(newTab),
      });
      expect(link.getAttribute('href')).toBe(href);
      expect(link.getAttribute('target')).toBe('_blank');
    }

    expect(container.textContent).not.toMatch(/[{}]/);
  }
);

test('both languages have the same sections, lists and links in the same order', () => {
  const shape = (locale: Lang) =>
    dictionaries[locale].privacy.sections.map(({ id, body }) => ({
      id,
      blocks: body.map((block) =>
        typeof block === 'string'
          ? (block.match(/\{\w+\}/g) ?? [])
          : block.map((item) => item.match(/\{\w+\}/g) ?? [])
      ),
    }));

  expect(shape('es')).toEqual(shape('en'));
});

test.each([
  ['en', 'Privacy'],
  ['es', 'Privacidad'],
] as const)(
  'the %s footer links the privacy page in the same language',
  async (lang, name) => {
    stubResizeObserver();
    render(
      <LanguageProvider locale={lang} content={dictionaries[lang]}>
        {await Footer({ lang })}
      </LanguageProvider>
    );

    const link = screen.getByRole('link', { name });
    expect(link.getAttribute('href')).toBe(`/${lang}/privacy`);
  }
);

test('unknown locales 404 instead of rendering the notice', async () => {
  await expect(renderPrivacy('xx' as Lang)).rejects.toThrow(
    'NEXT_HTTP_ERROR_FALLBACK;404'
  );
});

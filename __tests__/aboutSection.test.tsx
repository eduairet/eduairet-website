import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { LanguageProvider } from '@/store/LanguageProvider';
import { Dictionary, EnContent, EsContent } from '@/models';
import { buildHomeStructuredData } from '@/utils/server/structuredData.utils';

import AboutSection from '@/app/[locale]/components/AboutSection/AboutSection';
import EatHomeButton from '@/components/brand/EatHomeButton/EatHomeButton';

vi.mock('next/navigation', () => ({
  usePathname: () => '/en/contact',
}));

afterEach(cleanup);

test.each([
  ['en', EnContent, 'About'],
  ['es', EsContent, 'Sobre mí'],
] as const)(
  '%s About section has an h2, the text and the photo',
  (_, data, title) => {
    const content = new Dictionary(data);
    render(<AboutSection id='about' about={content.about} />);

    expect(screen.getByRole('heading', { level: 2, name: title })).toBeTruthy();
    expect(screen.getByText(content.about.text)).toBeTruthy();

    const photo = screen.getByRole('img', { name: 'Eduardo Aire Torres' });
    expect(photo.getAttribute('width')).toBe('160');
    expect(photo.getAttribute('height')).toBe('160');
    expect(photo.getAttribute('loading')).toBe('lazy');
  }
);

test('the photo comes in the sizes it is shown at', () => {
  render(<AboutSection id='about' about={new Dictionary(EnContent).about} />);
  const photo = screen.getByRole('img');

  expect(photo.getAttribute('srcset')).toBe(
    '/eduardo-aire-torres-160.webp 160w, /eduardo-aire-torres-256.webp 256w, /eduardo-aire-torres.webp 400w'
  );
  expect(photo.getAttribute('sizes')).toBe('(min-width: 768px) 160px, 128px');
});

test('Person.image is the photo the About section shows', async () => {
  const content = new Dictionary(EnContent);
  render(<AboutSection id='about' about={content.about} />);
  const photo = screen.getByRole('img');
  const src = photo.getAttribute('src');
  const { mainEntity } = (await buildHomeStructuredData('en'))['@graph'][1];

  expect(mainEntity.image).toBe(`https://www.eduairet.com${src}`);
  expect(photo.getAttribute('srcset')).toContain(`${src} 400w`);
  expect(mainEntity.description).toBe(content.about.text);
});

test('the logo link is named Home and has no photo', () => {
  render(
    <LanguageProvider locale='en' content={new Dictionary(EnContent)}>
      <EatHomeButton locale='en' />
    </LanguageProvider>
  );
  const link = screen.getByRole('link', { name: 'Home' });
  expect(link.querySelector('img')).toBeNull();
});

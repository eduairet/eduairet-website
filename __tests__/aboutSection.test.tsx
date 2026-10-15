import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { act, cleanup, render, screen } from '@testing-library/react';
import { LanguageProvider } from '@/store/LanguageProvider';
import { Dictionary, EnContent, EsContent } from '@/models';
import { buildHomeStructuredData } from '@/utils/server/structuredData.utils';

import AboutSection from '@/app/[locale]/components/AboutSection/AboutSection';
import revealStyles from '@/components/wrappers/RevealOnScroll/RevealOnScroll.module.scss';
import EatHomeButton from '@/components/brand/EatHomeButton/EatHomeButton';

vi.mock('next/navigation', () => ({
  usePathname: () => '/en/contact',
  useRouter: () => ({ prefetch: () => {} }),
}));

// eslint-disable-next-line no-unused-vars
let notify: (isIntersecting: boolean) => void = () => {};

beforeEach(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe: (target: Element) => void; // eslint-disable-line no-unused-vars
      constructor(
        callback: (
          // eslint-disable-next-line no-unused-vars
          entries: { isIntersecting: boolean; target: Element }[]
        ) => void
      ) {
        this.observe = (target) => {
          notify = (isIntersecting) => callback([{ isIntersecting, target }]);
        };
      }
      unobserve() {}
      disconnect() {}
    }
  );
  vi.stubGlobal('matchMedia', () => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  }));
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

test.each([
  ['en', EnContent, 'About'],
  ['es', EsContent, 'Sobre mí'],
] as const)(
  '%s About section has an h2, the text and the video',
  (_, data, title) => {
    const content = new Dictionary(data);
    render(<AboutSection id='about' about={content.about} />);

    expect(screen.getByRole('heading', { level: 2, name: title })).toBeTruthy();
    expect(screen.getByText(content.about.text)).toBeTruthy();

    const portrait = screen.getByRole('img', { name: 'Eduardo Aire Torres' });
    const video = portrait.querySelector('video')!;
    expect(video.getAttribute('aria-hidden')).toBe('true');
    expect(video.getAttribute('width')).toBe('320');
    expect(video.getAttribute('height')).toBe('320');
  }
);

test('the block shows before scripts run, then fades in and out with the cards', () => {
  const about = new Dictionary(EnContent).about;
  render(<AboutSection id='about' about={about} />);
  const block = screen.getByText(about.text).parentElement!;
  expect(block.className).not.toContain(revealStyles.reveal);

  act(() => notify(true));
  expect(block.className).toContain(revealStyles.reveal);
  expect(block.className).toContain(revealStyles.inView);

  act(() => notify(false));
  expect(block.className).toContain(revealStyles.reveal);
  expect(block.className).not.toContain(revealStyles.inView);
});

test("Person.image is the About video's still", async () => {
  const content = new Dictionary(EnContent);
  render(<AboutSection id='about' about={content.about} />);
  const still = screen.getByRole('img').querySelector('img')!;
  const { mainEntity } = (await buildHomeStructuredData('en'))['@graph'][1];

  expect(mainEntity.image).toBe(
    `https://www.eduairet.com${still.getAttribute('src')}`
  );
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

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { act, cleanup, render, screen, within } from '@testing-library/react';
import { LanguageProvider } from '@/store/LanguageProvider';
import { Dictionary, EnContent } from '@/models';

import SectionCard from '@/app/[locale]/components/HomeSection/SectionCard';
import styles from '@/components/wrappers/RevealOnScroll/RevealOnScroll.module.scss';

const en = new Dictionary(EnContent);

let notify: (isIntersecting: boolean, top?: number) => void = () => {};
let options: { threshold?: number } | undefined;

beforeEach(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(
        callback: (
          entries: {
            isIntersecting: boolean;
            target: Element;
            boundingClientRect?: { top: number };
            rootBounds?: { top: number } | null;
          }[]
        ) => void,
        init?: { threshold?: number }
      ) {
        options = init;
        notify = (isIntersecting, top) =>
          callback([
            {
              isIntersecting,
              target: screen.getByRole('listitem'),
              boundingClientRect: { top: top ?? 0 },
              rootBounds: top == null ? null : { top: 0 },
            },
          ]);
      }
      observe() {}
      unobserve() {}
    }
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const entry = {
  role: 'Design Engineer',
  company: 'Studio',
  companyUrl: '',
  meta: '',
  period: '2024',
  description: 'Work.',
  stack: [],
};

describe('SectionCard', () => {
  test('shows each time it enters the viewport and hides when it leaves', () => {
    render(
      <LanguageProvider locale='en' content={en}>
        <SectionCard entry={entry} icons={[]} tools={[]} />
      </LanguageProvider>
    );
    const card = screen.getByRole('listitem');
    expect(options?.threshold).toBe(0.3);
    expect(card.className).not.toContain(styles.inView);

    act(() => notify(true));
    expect(card.className).toContain(styles.inView);

    act(() => notify(false));
    expect(card.className).not.toContain(styles.inView);

    act(() => notify(true));
    expect(card.className).toContain(styles.inView);
  });

  test('keeps a card shown after it scrolls off the top', () => {
    render(
      <LanguageProvider locale='en' content={en}>
        <SectionCard entry={entry} icons={[]} tools={[]} />
      </LanguageProvider>
    );
    const card = screen.getByRole('listitem');

    act(() => notify(true));
    act(() => notify(false, -200));
    expect(card.className).toContain(styles.inView);
  });

  test('lists the icons by name, then the other tools as text', () => {
    render(
      <LanguageProvider locale='en' content={en}>
        <SectionCard
          entry={entry}
          icons={['nextjs', 'claudecode']}
          tools={['Glyphs', 'AWS']}
        />
      </LanguageProvider>
    );
    const stack = screen.getByRole('list', { name: en.home.techStack });
    const icons = within(stack).getAllByRole('img');
    expect(icons.map((icon) => icon.getAttribute('aria-label'))).toEqual([
      'Next.js',
      'Claude Code',
    ]);
    for (const icon of icons) {
      expect(icon.querySelector('path')?.getAttribute('d')).toBeTruthy();
    }
    const items = within(stack).getAllByRole('listitem');
    expect(
      items.map(
        (item) =>
          item.querySelector('[role="img"]')?.getAttribute('aria-label') ??
          item.textContent
      )
    ).toEqual(['Next.js', 'Claude Code', 'Glyphs', 'AWS']);
  });
});

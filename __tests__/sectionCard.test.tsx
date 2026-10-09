import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { act, cleanup, render, screen } from '@testing-library/react';
import { LanguageProvider } from '@/store/LanguageProvider';
import { Dictionary, EnContent } from '@/models';

const en = new Dictionary(EnContent);
import SectionCard from '@/app/[locale]/components/HomeSection/SectionCard';
import styles from '@/app/[locale]/components/HomeSection/HomeSection.module.scss';

vi.mock('next/navigation', () => ({
  useParams: () => ({ locale: 'en' }),
}));

// eslint-disable-next-line no-unused-vars
let notify: (isIntersecting: boolean) => void = () => {};
let options: { threshold?: number } | undefined;

beforeEach(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(
        // eslint-disable-next-line no-unused-vars
        callback: (entries: { isIntersecting: boolean }[]) => void,
        init?: { threshold?: number }
      ) {
        options = init;
        notify = (isIntersecting) => callback([{ isIntersecting }]);
      }
      observe() {}
      disconnect() {}
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
        <SectionCard entry={entry} icons={[]} />
      </LanguageProvider>
    );
    const card = screen.getByRole('listitem');
    expect(options?.threshold).toBe(0.3);
    expect(card.className).not.toContain(styles.inView);

    act(() => notify(true));
    expect(card.className).toContain(styles.inView);

    act(() => notify(false));
    expect(card.className).not.toContain(styles.inView);
  });
});

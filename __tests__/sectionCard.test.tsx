import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { act, cleanup, render, screen } from '@testing-library/react';
import { LanguageProvider } from '@/store/LanguageProvider';
import SectionCard from '@/app/[locale]/components/HomeSection/SectionCard';
import styles from '@/app/[locale]/components/HomeSection/HomeSection.module.scss';

vi.mock('next/navigation', () => ({
  useParams: () => ({ locale: 'en' }),
}));

let notify: (isIntersecting: boolean) => void = () => {};
let options: IntersectionObserverInit | undefined;

beforeEach(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(
        callback: IntersectionObserverCallback,
        init?: IntersectionObserverInit
      ) {
        options = init;
        notify = (isIntersecting) =>
          callback(
            [{ isIntersecting } as IntersectionObserverEntry],
            this as unknown as IntersectionObserver
          );
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
      <LanguageProvider>
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

import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { LanguageProvider } from '@/store/LanguageProvider';
import ThemeButton from '@/components/ui/Buttons/ThemeButton/ThemeButton';
import HomeSubtitle from '@/app/[locale]/components/HomeSubtitle/HomeSubtitle';
import Spinner from '@/components/ui/Spinner/Spinner';

vi.mock('next/navigation', () => ({
  useParams: () => ({ locale: 'en' }),
  usePathname: () => '/en',
}));

afterEach(() => {
  cleanup();
  localStorage.clear();
});

describe('Theme toggle', () => {
  test('its name says what it will do and updates after toggling', () => {
    localStorage.setItem('theme', 'dark');
    render(
      <LanguageProvider>
        <ThemeButton />
      </LanguageProvider>
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'Switch to light theme' })
    );

    expect(
      screen.getByRole('button', { name: 'Switch to dark theme' })
    ).toBeTruthy();
    expect(document.body.getAttribute('data-theme')).toBe('light');
  });
});

describe('Text alternatives', () => {
  test('home subtitle keeps spaces between words', () => {
    render(<HomeSubtitle subtitle='Design Engineer · Product Engineer' />);
    expect(screen.getByRole('heading').textContent).toBe(
      'Design Engineer · Product Engineer'
    );
  });

  test('spinner is named only when given a label', () => {
    const { container } = render(
      <>
        <Spinner label='Sending…' />
        <Spinner />
      </>
    );
    const [named, decorative] = container.querySelectorAll('svg');

    expect(named.getAttribute('role')).toBe('img');
    expect(named.getAttribute('aria-label')).toBe('Sending…');
    expect(decorative.getAttribute('aria-hidden')).toBe('true');
  });
});

import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { LanguageProvider } from '@/store/LanguageProvider';
import { Dictionary, EnContent } from '@/models';

import ThemeButton from '@/components/ui/Buttons/ThemeButton/ThemeButton';
import HomeSubtitle from '@/app/[locale]/components/HomeSubtitle/HomeSubtitle';
import Spinner from '@/components/ui/Spinner/Spinner';
import { THEME_COLORS, THEME_INIT_SCRIPT } from '@/utils/constants';

const en = new Dictionary(EnContent);

vi.mock('next/navigation', () => ({
  usePathname: () => '/en',
}));

afterEach(() => {
  cleanup();
  localStorage.clear();
  document.head.innerHTML = '';
});

// The tag Next renders from the viewport's themeColor.
const addThemeColorTag = () => {
  document.head.innerHTML = `<meta name="theme-color" content="${THEME_COLORS.dark}">`;
};

const themeColor = () =>
  document.querySelector('meta[name="theme-color"]')?.getAttribute('content');

describe('Theme toggle', () => {
  test('its name says what it will do and updates after toggling', () => {
    localStorage.setItem('theme', 'dark');
    render(
      <LanguageProvider locale='en' content={en}>
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

  test("paints the browser's bars in the chosen theme", () => {
    addThemeColorTag();
    localStorage.setItem('theme', 'dark');
    render(
      <LanguageProvider locale='en' content={en}>
        <ThemeButton />
      </LanguageProvider>
    );
    expect(themeColor()).toBe(THEME_COLORS.dark);

    fireEvent.click(
      screen.getByRole('button', { name: 'Switch to light theme' })
    );
    expect(themeColor()).toBe(THEME_COLORS.light);
  });
});

describe('Theme before first paint', () => {
  const runScript = (prefersLight: boolean) => {
    window.matchMedia = vi.fn(() => ({
      matches: prefersLight,
    })) as unknown as typeof window.matchMedia;
    document.body.removeAttribute('data-theme');
    new Function(THEME_INIT_SCRIPT)();
    return document.body.getAttribute('data-theme');
  };

  test('uses the saved theme', () => {
    localStorage.setItem('theme', 'light');
    expect(runScript(false)).toBe('light');
  });

  test('falls back to the OS preference', () => {
    expect(runScript(true)).toBe('light');
    expect(runScript(false)).toBe('dark');
  });

  test("paints the browser's bars in the saved theme", () => {
    addThemeColorTag();
    localStorage.setItem('theme', 'light');
    runScript(false);
    expect(themeColor()).toBe(THEME_COLORS.light);
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

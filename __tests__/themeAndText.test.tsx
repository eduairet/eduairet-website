import { afterEach, describe, expect, test, vi } from 'vitest';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import { LanguageProvider } from '@/store/LanguageProvider';
import { Dictionary, EnContent, type Theme } from '@/models';

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
  vi.restoreAllMocks();
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
    addThemeColorTag();
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
    expect(themeColor()).toBe(THEME_COLORS.light);
  });

  const saveTheme = (theme: Theme) => {
    addThemeColorTag();
    localStorage.setItem('theme', theme);
  };

  const renderTwoButtons = () =>
    render(
      <LanguageProvider locale='en' content={en}>
        <ThemeButton />
        <ThemeButton />
      </LanguageProvider>
    );

  const countThemeWrites = () => {
    const spy = vi.spyOn(document.body, 'setAttribute');
    return () => spy.mock.calls.filter(([n]) => n === 'data-theme').length;
  };

  const expectLightOnBothButtons = () => {
    expect(document.body.getAttribute('data-theme')).toBe('light');
    expect(themeColor()).toBe(THEME_COLORS.light);
    expect(
      screen.getAllByRole('button', { name: 'Switch to dark theme' })
    ).toHaveLength(2);
  };

  test('two buttons update together and write the page once per toggle', () => {
    saveTheme('dark');
    renderTwoButtons();

    const writes = countThemeWrites();
    fireEvent.click(
      screen.getAllByRole('button', { name: 'Switch to light theme' })[0]
    );

    expect(writes()).toBe(1);
    expectLightOnBothButtons();
  });

  test('mounting restores the saved theme on the page once', () => {
    saveTheme('light');
    document.body.removeAttribute('data-theme');

    const writes = countThemeWrites();
    renderTwoButtons();

    expect(writes()).toBe(1);
    expectLightOnBothButtons();
  });

  test('follows a theme saved in another tab', () => {
    saveTheme('dark');
    renderTwoButtons();
    const fireStorage = (key: string) =>
      act(() => {
        window.dispatchEvent(new StorageEvent('storage', { key }));
      });

    const writes = countThemeWrites();
    fireStorage('other');
    expect(writes()).toBe(0);

    localStorage.setItem('theme', 'light');
    fireStorage('theme');

    expect(writes()).toBe(1);
    expectLightOnBothButtons();
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
    addThemeColorTag();
    localStorage.setItem('theme', 'light');
    expect(runScript(false)).toBe('light');
    expect(themeColor()).toBe(THEME_COLORS.light);
  });

  test('falls back to the OS preference', () => {
    expect(runScript(true)).toBe('light');
    expect(runScript(false)).toBe('dark');
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

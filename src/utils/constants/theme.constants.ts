import { Colors } from './color.constants';

export type Theme = 'dark' | 'light';

export const THEME_STORAGE_KEY = 'theme';

export const THEME_COLORS: Record<Theme, string> = {
  dark: Colors.black,
  light: Colors.white,
};

// The saved choice, else the OS preference. Self-contained, because it is
// also inlined as a script that runs before the body paints.
export function resolveTheme(storageKey: string): Theme {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved === 'light' || saved === 'dark') return saved;
    return matchMedia('(prefers-color-scheme: light)').matches
      ? 'light'
      : 'dark';
  } catch {
    return 'dark';
  }
}

// Chrome on Android tints its bar from theme-color; iOS Safari ignores it.
// Self-contained for the same reason as resolveTheme.
export function applyThemeToPage(theme: Theme, colors: Record<Theme, string>) {
  document.body.setAttribute('data-theme', theme);
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', colors[theme]);
}

export const THEME_INIT_SCRIPT = `(${applyThemeToPage})((${resolveTheme})(${JSON.stringify(
  THEME_STORAGE_KEY
)}),${JSON.stringify(THEME_COLORS)})`;

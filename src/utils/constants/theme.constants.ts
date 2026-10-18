import type { Theme } from '@/models';
import { Colors } from './color.constants';

export const THEME_STORAGE_KEY = 'theme';

export const THEME_COLORS: Record<Theme, string> = {
  dark: Colors.black,
  light: Colors.white,
};

// Saved choice, else the OS setting. Inlined before paint, so this function cannot import.
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

// Chrome on Android tints the bar from theme-color. iOS Safari ignores it. Inlined before paint, same as resolveTheme.
export function applyThemeToPage(theme: Theme, colors: Record<Theme, string>) {
  document.body.setAttribute('data-theme', theme);
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', colors[theme]);
}

export const THEME_INIT_SCRIPT = `(${applyThemeToPage})((${resolveTheme})(${JSON.stringify(
  THEME_STORAGE_KEY
)}),${JSON.stringify(THEME_COLORS)})`;

import { Colors } from './color.constants';

export const THEME_STORAGE_KEY = 'theme';

export const THEME_COLORS = { dark: Colors.black, light: Colors.white };

// The saved choice, else the OS preference. Self-contained, because it is
// also inlined as a script that runs before the body paints.
export function resolveTheme(storageKey: string): 'dark' | 'light' {
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

// The theme-color tags follow the OS theme; Safari tints its bars from them.
// Self-contained for the same reason as resolveTheme.
export function applyThemeColor(
  theme: 'dark' | 'light',
  colors: Record<'dark' | 'light', string>
) {
  document
    .querySelectorAll('meta[name="theme-color"]')
    .forEach((meta) => meta.setAttribute('content', colors[theme]));
}

export const THEME_INIT_SCRIPT = `(function(t){document.body.setAttribute('data-theme',t);(${applyThemeColor})(t,${JSON.stringify(
  THEME_COLORS
)})})((${resolveTheme})(${JSON.stringify(THEME_STORAGE_KEY)}))`;

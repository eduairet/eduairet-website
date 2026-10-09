export const THEME_STORAGE_KEY = 'theme';

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

export const THEME_INIT_SCRIPT = `document.body.setAttribute('data-theme',(${resolveTheme})(${JSON.stringify(
  THEME_STORAGE_KEY
)}))`;

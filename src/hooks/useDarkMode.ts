'use client';

import { useEffect, useSyncExternalStore } from 'react';
import {
  THEME_COLORS,
  THEME_STORAGE_KEY,
  applyThemeColor,
  resolveTheme,
} from '@/utils/constants';

export type Theme = 'dark' | 'light';

const listeners = new Set<() => void>();

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  window.addEventListener('storage', onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener('storage', onStoreChange);
  };
}

function emit() {
  listeners.forEach((listener) => listener());
}

const getTheme = (): Theme => resolveTheme(THEME_STORAGE_KEY);

// The theme as applied to the page, for code outside React.
export const readTheme = (): Theme =>
  document.body.getAttribute('data-theme') === 'light' ? 'light' : 'dark';

function applyTheme(theme: Theme) {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  document.body.setAttribute('data-theme', theme);
  emit();
}

export default function useDarkMode() {
  const theme = useSyncExternalStore(
    subscribe,
    getTheme,
    () => 'dark' as const
  );

  useEffect(() => {
    const resolved = getTheme();
    document.body.setAttribute('data-theme', resolved);
    applyThemeColor(resolved, THEME_COLORS);
    if (!localStorage.getItem(THEME_STORAGE_KEY))
      localStorage.setItem(THEME_STORAGE_KEY, resolved);
  }, [theme]);

  const toggleDarkMode = () => {
    applyTheme(getTheme() === 'light' ? 'dark' : 'light');
  };

  return { darkMode: theme === 'dark', toggleDarkMode };
}

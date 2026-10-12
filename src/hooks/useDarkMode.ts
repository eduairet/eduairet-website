'use client';

import { useSyncExternalStore } from 'react';
import {
  THEME_COLORS,
  THEME_STORAGE_KEY,
  type Theme,
  applyThemeToPage,
  resolveTheme,
} from '@/utils/constants';

const listeners = new Set<() => void>();

const getTheme = (): Theme => resolveTheme(THEME_STORAGE_KEY);

// The theme as applied to the page, for code outside React.
export const readTheme = (): Theme =>
  document.body.getAttribute('data-theme') === 'light' ? 'light' : 'dark';

function syncPage(theme = getTheme()) {
  applyThemeToPage(theme, THEME_COLORS);
  if (!localStorage.getItem(THEME_STORAGE_KEY))
    localStorage.setItem(THEME_STORAGE_KEY, theme);
}

function emit() {
  listeners.forEach((listener) => listener());
}

function onStorage() {
  const theme = getTheme();
  if (theme === readTheme()) return;
  syncPage(theme);
  emit();
}

// The page is synced once per change, however many hooks are mounted.
function subscribe(onStoreChange: () => void) {
  if (listeners.size === 0) {
    // React clears <body> attributes when it mounts a new body.
    syncPage();
    window.addEventListener('storage', onStorage);
  }
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
    if (listeners.size === 0) window.removeEventListener('storage', onStorage);
  };
}

function applyTheme(theme: Theme) {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  syncPage(theme);
  emit();
}

export default function useDarkMode() {
  const theme = useSyncExternalStore(
    subscribe,
    getTheme,
    () => 'dark' as const
  );

  const toggleDarkMode = () => {
    applyTheme(getTheme() === 'light' ? 'dark' : 'light');
  };

  return { darkMode: theme === 'dark', toggleDarkMode };
}

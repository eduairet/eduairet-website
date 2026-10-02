'use client';

import { useEffect, useSyncExternalStore } from 'react';

type Theme = 'dark' | 'light';

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

function getTheme(): Theme {
  const theme = localStorage.getItem('theme');
  if (theme === 'light' || theme === 'dark') return theme;
  const prefersLightMode =
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: light)').matches;
  return prefersLightMode ? 'light' : 'dark';
}

function applyTheme(theme: Theme) {
  localStorage.setItem('theme', theme);
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
    if (!localStorage.getItem('theme')) localStorage.setItem('theme', resolved);
  }, [theme]);

  const toggleDarkMode = () => {
    applyTheme(getTheme() === 'light' ? 'dark' : 'light');
  };

  return { darkMode: theme === 'dark', toggleDarkMode };
}

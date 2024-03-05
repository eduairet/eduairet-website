'use client';

import { useState, useEffect, useCallback } from 'react';

export default function useDarkMode() {
  const [darkMode, setDarkMode] = useState(true);

  const getTheme = () => {
    const theme = localStorage.getItem('theme');
    if (!theme) {
      const prefersLightMode =
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: light)').matches;
      return prefersLightMode ? 'light' : 'dark';
    }
    return theme;
  };

  const setTheme = useCallback((theme: string) => {
    localStorage.setItem('theme', theme);
    document.body.setAttribute('data-theme', theme);
    setDarkMode(theme === 'dark');
  }, []);

  const toggleDarkMode = () => {
    const theme = getTheme();
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  useEffect(() => {
    const theme = getTheme();
    setTheme(theme);

    const handleStorageChange = () => {
      const updatedTheme = getTheme();
      setTheme(updatedTheme);
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [setTheme]);

  useEffect(() => {
    const theme = getTheme();
    setTheme(theme);
  }, [setTheme]);

  return { darkMode, toggleDarkMode };
}

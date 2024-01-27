'use client';

import { useState, useEffect } from 'react';

export default function useDarkMode() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    localStorage.setItem('theme', !darkMode ? 'dark' : 'light');
    document.body.setAttribute('data-theme', !darkMode ? 'dark' : 'light');
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    const userPrefersDarkMode =
      (window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches) ||
      localStorage.getItem('theme') === 'dark';
    setDarkMode(userPrefersDarkMode);
    const theme = userPrefersDarkMode ? 'dark' : 'light';
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, []);

  return { darkMode, toggleDarkMode };
}

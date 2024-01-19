'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';

type ThemeContextType = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  toggleDarkMode: () => {},
});

interface IProps {
  children?: ReactNode;
}
export const ThemeProvider = (props: IProps) => {
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

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {props.children}
    </ThemeContext.Provider>
  );
};

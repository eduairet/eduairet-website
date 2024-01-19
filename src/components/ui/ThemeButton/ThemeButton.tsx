'use client';

import { useContext } from 'react';
import styles from './ThemeButton.module.scss';
import { ThemeContext } from '@/store/ThemeContext';
import Bulb from '@/components/svg/Bulb';

export default function ThemeButton() {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  const toggleTheme = () => {
    toggleDarkMode();
  };

  return (
    <button
      className={styles['theme-button']}
      aria-label='Toggle Dark Mode'
      onClick={toggleTheme}
    >
      <Bulb on={!darkMode} />
    </button>
  );
}

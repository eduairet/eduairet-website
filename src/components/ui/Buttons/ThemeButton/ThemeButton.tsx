'use client';

import { useContext } from 'react';
import styles from './ThemeButton.module.scss';
import useDarkMode from '@/hooks/useDarkMode';
import { LanguageContext } from '@/store/LanguageProvider';

export default function ThemeButton() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { content } = useContext(LanguageContext);

  const toggleTheme = () => {
    toggleDarkMode();
  };

  // Name the button by what it does next, so the current theme is implied.
  const label = darkMode
    ? content.buttons.themeButton.toLight
    : content.buttons.themeButton.toDark;

  return (
    <button
      type='button'
      aria-label={label}
      className={styles['icon-button']}
      onClick={toggleTheme}
    >
      <span
        aria-hidden='true'
        className={styles.bulb}
        style={{
          fontVariationSettings: darkMode ? "'wght' 100" : "'wght' 900",
        }}
      >
        💡
      </span>
    </button>
  );
}

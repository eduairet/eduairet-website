'use client';

import { useContext } from 'react';
import { motion } from 'framer-motion';
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
      <motion.span
        aria-hidden='true'
        className={styles.bulb}
        animate={{
          fontVariationSettings: darkMode ? "'wght' 100" : "'wght' 900",
          transition: { duration: 0.25 },
        }}
      >
        💡
      </motion.span>
    </button>
  );
}

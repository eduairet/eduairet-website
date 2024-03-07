'use client';

import { useContext } from 'react';
import { motion } from 'framer-motion';
import styles from './ThemeButton.module.scss';
import useDarkMode from '@/hooks/useDarkMode';
import { LanguageContext } from '@/store/LanguageProvider';
import IconButtonScreenTitle from '../IconButton/IconButtonScreenTitle';

export default function ThemeButton() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { content } = useContext(LanguageContext);

  const toggleTheme = () => {
    toggleDarkMode();
  };

  return (
    <button
      aria-label={content.buttons.themeButton.ariaLabel}
      className={styles['icon-button']}
      onClick={toggleTheme}
    >
      <motion.span
        className={styles.bulb}
        animate={{
          fontVariationSettings: darkMode ? "'wght' 100" : "'wght' 900",
          transition: { duration: 0.25 },
        }}
      >
        💡
      </motion.span>
      <IconButtonScreenTitle title={content.buttons.themeButton.title} />
    </button>
  );
}

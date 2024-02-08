'use client';

import { useContext } from 'react';
import styles from './HamburgerButton.module.scss';
import IconButtonScreenTitle from '@/components/ui/IconButton/IconButtonScreenTitle';
import { LanguageContext } from '@/store/LanguageProvider';

interface IProps {
  isActive: boolean;
  onClick: () => void;
}

export default function HamburgerButton({ isActive, onClick }: IProps) {
  const { content } = useContext(LanguageContext);

  return (
    <button
      aria-label={content.nav.menu}
      className={styles.hamburger}
      onClick={onClick}
    >
      <span
        className={[
          styles['hamburger-lines'],
          isActive ? styles.active : '',
        ].join(' ')}
      >
        <span></span>
        <span></span>
        <span></span>
      </span>
      <IconButtonScreenTitle title={content.nav.menu} />
    </button>
  );
}

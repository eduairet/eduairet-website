'use client';

import { memo, useContext } from 'react';
import styles from './HamburgerButton.module.scss';
import IconButtonScreenTitle from '@/components/ui/Buttons/IconButton/IconButtonScreenTitle';
import { LanguageContext } from '@/store/LanguageProvider';
import usePathTween from './usePathTween';

const paths = {
  top: { open: 'M5 5L25 25', closed: 'M5 8L25 8' },
  bottom: { open: 'M5 25L25 5', closed: 'M5 22L25 22' },
};

interface IProps {
  isActive: boolean;
  controls: string;
  onClick: () => void;
}

function HamburgerButton({ isActive, controls, onClick }: IProps) {
  const { content } = useContext(LanguageContext);
  const top = usePathTween(isActive ? paths.top.open : paths.top.closed);
  const bottom = usePathTween(
    isActive ? paths.bottom.open : paths.bottom.closed
  );

  return (
    <button
      type='button'
      aria-expanded={isActive}
      aria-controls={controls}
      className={styles.hamburger}
      onClick={onClick}
    >
      <svg
        className={isActive ? styles.active : ''}
        width='30'
        height='30'
        viewBox='0 0 30 30'
        focusable={false}
        xmlSpace='preserve'
        aria-hidden
      >
        <path ref={top.ref} d={top.d} />
        <path className={styles.middle} d='M5 15L25 15' />
        <path ref={bottom.ref} d={bottom.d} />
      </svg>
      <IconButtonScreenTitle title={content.nav.menu} />
    </button>
  );
}

export default memo(HamburgerButton);

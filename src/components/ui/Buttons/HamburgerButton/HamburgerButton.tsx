'use client';

import { memo, useContext, useRef } from 'react';
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
  const topRef = useRef<SVGPathElement>(null);
  const bottomRef = useRef<SVGPathElement>(null);
  const topD = usePathTween(
    topRef,
    isActive ? paths.top.open : paths.top.closed
  );
  const bottomD = usePathTween(
    bottomRef,
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
        <path ref={topRef} d={topD} />
        <path className={styles.middle} d='M5 15L25 15' />
        <path ref={bottomRef} d={bottomD} />
      </svg>
      <IconButtonScreenTitle title={content.nav.menu} />
    </button>
  );
}

export default memo(HamburgerButton);

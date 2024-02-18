'use client';

import { memo, useContext } from 'react';
import { motion } from 'framer-motion';
import styles from './HamburgerButton.module.scss';
import IconButtonScreenTitle from '@/components/ui/IconButton/IconButtonScreenTitle';
import { LanguageContext } from '@/store/LanguageProvider';

const paths = {
  top: { open: { d: 'M5 5L25 25' }, closed: { d: 'M5 8L25 8' } },
  bottom: { open: { d: 'M5 25L25 5' }, closed: { d: 'M5 22L25 22' } },
};

interface IProps {
  isActive: boolean;
  onClick: () => void;
}

function HamburgerButton({ isActive, onClick }: IProps) {
  const { content, isLoading } = useContext(LanguageContext);

  if (isLoading) return null;

  return (
    <button
      aria-label={content.nav.menu}
      className={styles.hamburger}
      onClick={onClick}
    >
      <svg
        width='30'
        height='30'
        viewBox='0 0 30 30'
        focusable={false}
        xmlSpace='preserve'
        aria-hidden
      >
        <motion.path
          d={isActive ? paths.top.open.d : paths.top.closed.d}
          initial={false}
          animate={isActive ? 'open' : 'closed'}
          variants={paths.top}
        />
        <motion.path
          d='M5 15L25 15'
          animate={isActive ? 'open' : 'closed'}
          variants={{
            open: { opacity: 0 },
            closed: { opacity: 1 },
          }}
        />
        <motion.path
          d={isActive ? paths.bottom.open.d : paths.bottom.closed.d}
          initial={false}
          animate={isActive ? 'open' : 'closed'}
          variants={paths.bottom}
        />
      </svg>
      <IconButtonScreenTitle title={content.nav.menu} />
    </button>
  );
}

export default memo(HamburgerButton);

'use client';

import { useContext } from 'react';
import styles from './LangMenu.module.scss';
import { LanguageContext } from '@/store/LanguageProvider';
import { BackdropContext } from '@/store/BackdropProvider';
import NavLink from '../NavLink/NavLink';
import GlobeButton from '@/components/ui/GlobeButton';
import { BackdropType } from '@/models';

export default function LangMenu() {
  const { content } = useContext(LanguageContext);
  const {
    backdropState: { navBackdrop },
    toggleBackdrop,
  } = useContext(BackdropContext);

  const openLanguages = () => {
    toggleBackdrop(BackdropType.NAV);
  };

  return (
    <div className={styles['langs-wrapper']}>
      <GlobeButton onClick={openLanguages} isActive={navBackdrop} />
      <ul
        className={[styles.actions, navBackdrop ? styles.opened : ''].join(' ')}
      >
        <NavLink href={'/en'} text={content.nav.langs.en} isLangLink />
        <NavLink href={'/es'} text={content.nav.langs.es} isLangLink />
      </ul>
    </div>
  );
}

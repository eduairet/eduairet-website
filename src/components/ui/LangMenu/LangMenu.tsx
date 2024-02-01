'use client';

import { useState, useContext } from 'react';
import styles from './LangMenu.module.scss';
import { LanguageContext } from '@/store/LanguageProvider';
import NavLink from '../NavLink/NavLink';
import GlobeButton from '@/components/svg/GlobeButton';

export default function LangMenu() {
  const { content } = useContext(LanguageContext);
  const [isOpened, setIsOpened] = useState<boolean>(false);

  const openLanguages = () => {
    setIsOpened((prevValue: boolean) => !prevValue);
  };

  return (
    <div className={styles['langs-wrapper']}>
      <GlobeButton onClick={openLanguages} isActive={isOpened} />
      <ul className={[styles.actions, isOpened ? styles.opened : ''].join(' ')}>
        <NavLink href={'/en'} text={content.nav.langs.en} isLangLink />
        <NavLink href={'/es'} text={content.nav.langs.es} isLangLink />
      </ul>
    </div>
  );
}

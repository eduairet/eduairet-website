'use client';

import { useContext } from 'react';
import { LanguageContext } from '@/store/LanguageContext';
import styles from './NavBar.module.scss';
import { Lang } from '@/models';
import NavLink from '../NavLink/NavLink';

export default function NavBar() {
  const { language, updateLanguage } = useContext(LanguageContext);

  return (
    <>
      <nav className={styles.nav}>
        <ul className={styles.actions}>
          <NavLink href='/' text='Home' />
          <NavLink
            href='/contact'
            text={language === Lang.SP ? 'Contacto' : 'Contact'}
          />
        </ul>
        <ul className={styles.actions}>
          <li className={styles.languages}>
            <button
              className={language === Lang.EN ? styles.active : ''}
              onClick={() => updateLanguage(Lang.EN)}
            >
              {language == Lang.EN ? 'ENG' : 'ING'}
            </button>
            <button
              className={language === Lang.SP ? styles.active : ''}
              onClick={() => updateLanguage(Lang.SP)}
            >
              {language == Lang.EN ? 'SPN' : 'ESP'}
            </button>
          </li>
        </ul>
      </nav>
      <div className={styles.divider}></div>
    </>
  );
}

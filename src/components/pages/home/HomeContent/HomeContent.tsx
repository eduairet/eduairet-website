'use client';

import { useContext } from 'react';
import { LanguageContext } from '@/store/LanguageContext';
import styles from './HomeContent.module.scss';
import { Lang } from '@/models';

const content = {
  [Lang.EN]: {
    subtitle: 'Developer | Designer | Artist',
    comingSoon: 'Coming soon...',
  },
  [Lang.SP]: {
    subtitle: 'Desarrollador | Diseñador | Artista',
    comingSoon: 'Próximamente...',
  },
};

export default function HomeContent() {
  const { language } = useContext(LanguageContext);

  return (
    <>
      <h1 className={styles.title}>Eduardo Aire Torres</h1>
      <h3 className={styles.subtitle}>{content[language].subtitle}</h3>
      <p>{content[language].comingSoon}</p>
    </>
  );
}

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

interface IProps {
  lang: Lang;
}

export default function HomeContent({ lang }: IProps) {
  return (
    <>
      <h1 className={styles.title}>Eduardo Aire Torres</h1>
      <h3 className={styles.subtitle}>{content[lang].subtitle}</h3>
      <p>{content[lang].comingSoon}</p>
    </>
  );
}

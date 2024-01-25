import styles from './HomeContent.module.scss';
import { getDictionary } from '@/app/[locale]/dictionaries';
import { Lang } from '@/models';

interface IProps {
  lang: Lang;
}

export default async function HomeContent({ lang }: IProps) {
  const content = await getDictionary(lang);

  return (
    <>
      <h1 className={styles.title}>Eduardo Aire Torres</h1>
      <h3 className={styles.subtitle}>{content.home.subtitle}</h3>
      <p>{content.home.text}</p>
    </>
  );
}

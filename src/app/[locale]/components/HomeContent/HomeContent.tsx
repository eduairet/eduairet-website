import styles from './HomeContent.module.scss';
import { Dictionary } from '@/models';
import HomeTitle from '@/app/[locale]/components/HomeTitle/HomeTitle';

interface IProps {
  content: Dictionary;
}

export default function HomeContent({ content }: IProps) {
  return (
    <section className={styles.content}>
      <HomeTitle />
      <h2 className={styles.subtitle}>{content.home.subtitle}</h2>
    </section>
  );
}

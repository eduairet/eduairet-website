import styles from './HomeContent.module.scss';
import { Dictionary } from '@/models';
import EatLogoBg from '@/components/brand/EatLogoBg';

interface IProps {
  content: Dictionary;
}

export default function HomeContent({ content }: IProps) {
  return (
    <section className={styles.content}>
      <EatLogoBg />
      <h1 className={styles.title}>Eduardo Aire Torres</h1>
      <h2 className={styles.subtitle}>{content.home.subtitle}</h2>
    </section>
  );
}

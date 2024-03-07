import styles from './HomeContent.module.scss';
import { Dictionary } from '@/models';
import HomeTitle from '@/app/[locale]/components/HomeTitle/HomeTitle';
import HomeSubtitle from '../HomeSubtitle/HomeSubtitle';

interface IProps {
  content: Dictionary;
}

export default function HomeContent({ content }: IProps) {
  return (
    <section className={styles.content}>
      <HomeTitle />
      <HomeSubtitle subtitle={content.home.subtitle} />
    </section>
  );
}

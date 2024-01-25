import { getYear } from '@/services';
import styles from './Footer.module.scss';
import ThemeButton from '../ThemeButton/ThemeButton';

export default async function Footer() {
  const currentYear = await getYear();

  return (
    <footer className={styles.footer}>
      <p>Eduardo Aire Torres {currentYear}</p>
      <ThemeButton />
    </footer>
  );
}

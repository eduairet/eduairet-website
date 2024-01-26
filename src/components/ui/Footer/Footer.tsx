import styles from './Footer.module.scss';
import ThemeButton from '../../svg/ThemeButton';

export default async function Footer() {
  return (
    <footer className={styles.footer}>
      <p>Eduardo Aire Torres {new Date().getFullYear()}</p>
      <ThemeButton />
    </footer>
  );
}

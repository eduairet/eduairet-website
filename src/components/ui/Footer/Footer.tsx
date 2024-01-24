import CurrentDate from '../CurrentDate/CurrentDate';
import ThemeButton from '../ThemeButton/ThemeButton';
import styles from './Footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>
        Eduardo Aire Torres <CurrentDate />
      </p>
      <ThemeButton />
    </footer>
  );
}

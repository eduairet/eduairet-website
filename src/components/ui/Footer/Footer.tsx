import styles from './Footer.module.scss';
import ThemeButton from '../../svg/ThemeButton';
import GitHubIcon from '@/components/svg/GitHubIcon';

export default async function Footer() {
  return (
    <footer className={styles.footer}>
      <p>Eduardo Aire Torres {new Date().getFullYear()}</p>
      <GitHubIcon />
      <ThemeButton />
    </footer>
  );
}

import styles from './page.module.scss';
import EatLogo from '@/components/svg/EatLogo';

export default function Home() {
  return (
    <main className={styles.main}>
      <picture className={styles.picture}>
        <EatLogo />
      </picture>
      <h1 className={styles.title}>Eduardo Aire Portfolio</h1>
      <h3 className={styles.subtitle}>Developer | Designer | Artist</h3>
      <p>Coming soon...</p>
    </main>
  );
}

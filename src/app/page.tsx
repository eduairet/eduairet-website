import styles from './page.module.scss';
import EatLogoBg from '@/components/brand/EatLogoBg';

export default function Home() {
  return (
    <main className={styles.main}>
      <EatLogoBg />
      <h1 className={styles.title}>Eduardo Aire Portfolio</h1>
      <h3 className={styles.subtitle}>Developer | Designer | Artist</h3>
      <p>Coming soon...</p>
    </main>
  );
}

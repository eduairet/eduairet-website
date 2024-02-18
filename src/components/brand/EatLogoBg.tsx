import styles from './EatLogoBg.module.scss';
import EatLogo from '@/components/brand/EatLogo';

export default function EatLogoBg() {
  return (
    <picture className={styles.picture}>
      <EatLogo />
    </picture>
  );
}

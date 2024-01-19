import styles from './EatLogoBg.module.scss';
import EatLogo from '@/components/svg/EatLogo';

export default function EatLogoBg() {
  return (
    <picture className={styles.picture}>
      <EatLogo />
    </picture>
  );
}

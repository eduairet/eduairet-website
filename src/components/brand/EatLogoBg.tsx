import styles from './EatLogoBg.module.scss';
import RotationTransition from '../transitions/RotationTransition';
import EatLogo from '@/components/brand/EatLogo';

export default function EatLogoBg() {
  return (
    <RotationTransition>
      <picture className={styles.picture}>
        <EatLogo />
      </picture>
    </RotationTransition>
  );
}

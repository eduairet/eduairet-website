import styles from './EatLogoBg.module.scss';
import EatLogo from '@/components/brand/EatLogo';

interface IProps {
  small?: boolean;
}

export default function EatLogoBg({ small = false }: IProps) {
  return (
    <picture className={[styles.picture, small ? styles.small : ''].join(' ')}>
      <EatLogo />
    </picture>
  );
}

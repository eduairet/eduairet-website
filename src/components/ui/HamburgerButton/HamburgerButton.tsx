import IconButtonScreenTitle from '../IconButton/IconButtonScreenTitle';
import styles from './HamburgerButton.module.scss';

interface IProps {
  isActive: boolean;
  onClick: () => void;
}

export default function HamburgerButton({ isActive, onClick }: IProps) {
  return (
    <button aria-label='Menu' className={styles.hamburger} onClick={onClick}>
      <span
        className={[
          styles['hamburger-lines'],
          isActive ? styles.active : '',
        ].join(' ')}
      >
        <span></span>
        <span></span>
        <span></span>
      </span>
      <IconButtonScreenTitle title='Menu' />
    </button>
  );
}

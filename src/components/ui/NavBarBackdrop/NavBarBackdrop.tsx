import styles from './NavBarBackdrop.module.scss';

interface IProps {
  toggleBackdrop: () => void;
}

export default function NavBarBackdrop({ toggleBackdrop }: IProps) {
  return (
    <div
      className={styles['nav-bar-backdrop']}
      onClick={toggleBackdrop}
      onScroll={toggleBackdrop}
    />
  );
}

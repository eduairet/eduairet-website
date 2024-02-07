import styles from './NavBarBackdrop.module.scss';

interface IProps {
  closeBackdrop: () => void;
}

export default function NavBarBackdrop({ closeBackdrop }: IProps) {
  return (
    <div
      className={styles['nav-bar-backdrop']}
      onClick={closeBackdrop}
      onScroll={closeBackdrop}
    />
  );
}

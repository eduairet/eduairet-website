import { memo } from 'react';
import styles from './NavBarBackdrop.module.scss';

interface IProps {
  closeBackdrop: () => void;
}

function NavBarBackdrop({ closeBackdrop }: IProps) {
  return (
    <div
      className={styles['nav-bar-backdrop']}
      onClick={closeBackdrop}
      onScroll={closeBackdrop}
    />
  );
}

export default memo(NavBarBackdrop);

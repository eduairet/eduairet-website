import { ReactNode } from 'react';
import styles from './NavDropdown.module.scss';

interface IProps {
  children: ReactNode;
  isOpen: boolean;
  onClick?: () => void;
}

export default function NavDropdown({ children, isOpen, onClick }: IProps) {
  return (
    <div className={styles.dropdownWrapper}>
      <ul
        className={[styles.actions, isOpen ? styles.opened : ''].join(' ')}
        onClick={onClick}
      >
        {children}
      </ul>
    </div>
  );
}

import { ReactNode } from 'react';
import styles from './NavDropdown.module.scss';

interface IProps {
  id: string;
  children: ReactNode;
  isOpen: boolean;
  onClick?: () => void;
}

export default function NavDropdown({ id, children, isOpen, onClick }: IProps) {
  return (
    <div className={styles.dropdownWrapper}>
      <ul
        id={id}
        className={[styles.actions, isOpen ? styles.opened : ''].join(' ')}
        onClick={onClick}
      >
        {children}
      </ul>
    </div>
  );
}

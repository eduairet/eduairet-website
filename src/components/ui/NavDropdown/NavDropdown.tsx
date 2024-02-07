import { ReactNode } from 'react';
import styles from './NavDropdown.module.scss';

interface IProps {
  children: ReactNode;
  isOpen: boolean;
}

export default function NavDropdown({ children, isOpen }: IProps) {
  return (
    <ul className={[styles.actions, isOpen ? styles.opened : ''].join(' ')}>
      {children}
    </ul>
  );
}

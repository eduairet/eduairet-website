import { ReactNode, memo } from 'react';
import styles from './NavDropdown.module.scss';

interface IProps {
  children: ReactNode;
  isOpen: boolean;
  onClick?: () => void;
}

function NavDropdown({ children, isOpen, onClick }: IProps) {
  return (
    <ul
      className={[styles.actions, isOpen ? styles.opened : ''].join(' ')}
      onClick={onClick}
    >
      {children}
    </ul>
  );
}

export default memo(NavDropdown);

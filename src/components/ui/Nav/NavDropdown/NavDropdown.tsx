import { MouseEvent, ReactNode } from 'react';
import styles from './NavDropdown.module.scss';

interface IProps {
  id: string;
  children: ReactNode;
  isOpen: boolean;
  fullScreenOnPhone?: boolean;
  onClick?: (e: MouseEvent) => void;
}

export default function NavDropdown({
  id,
  children,
  isOpen,
  fullScreenOnPhone = false,
  onClick,
}: IProps) {
  return (
    <div className={styles.dropdownWrapper}>
      <ul
        id={id}
        className={[
          styles.actions,
          fullScreenOnPhone && styles['full-screen'],
          isOpen && styles.opened,
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={onClick}
      >
        {children}
      </ul>
    </div>
  );
}

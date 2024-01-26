import { ReactNode } from 'react';
import styles from './IconButton.module.scss';
import SvgWrapper from '../SvgWrapper';

interface IProps {
  children: ReactNode;
  ariaLabel?: string;
  onClick?: () => void;
}

export default function IconButton({ children, ariaLabel, onClick }: IProps) {
  return (
    <button
      aria-label={ariaLabel}
      className={styles['icon-button']}
      onClick={onClick}
    >
      <SvgWrapper>{children}</SvgWrapper>
    </button>
  );
}

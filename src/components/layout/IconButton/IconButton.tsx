import { ReactNode } from 'react';
import styles from './IconButton.module.scss';
import SvgWrapper from '../SvgWrapper';
import IconButtonScreenTitle from './IconButtonScreenTitle';

interface IProps {
  children: ReactNode;
  title?: string;
  ariaLabel?: string;
  isActive?: boolean;
  onClick?: () => void;
}

export default function IconButton({
  children,
  ariaLabel,
  onClick,
  title = 'Button',
  isActive = false,
}: IProps) {
  return (
    <button
      aria-label={ariaLabel}
      className={[styles['icon-button'], isActive ? styles.active : ''].join(
        ' '
      )}
      onClick={onClick}
    >
      <SvgWrapper>{children}</SvgWrapper>
      <IconButtonScreenTitle title={title} />
    </button>
  );
}

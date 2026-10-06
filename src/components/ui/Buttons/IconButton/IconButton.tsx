import { ReactNode } from 'react';
import styles from './IconButton.module.scss';
import SvgWrapper from '@/components/wrappers/SvgWrapper';
import IconButtonScreenTitle from './IconButtonScreenTitle';

interface IProps {
  children: ReactNode;
  title?: string;
  ariaLabel?: string;
  isActive?: boolean;
  // Pass `controls` for buttons that toggle a menu, so the open state is exposed.
  controls?: string;
  onClick?: () => void;
}

export default function IconButton({
  children,
  ariaLabel,
  onClick,
  controls,
  title = 'Button',
  isActive = false,
}: IProps) {
  return (
    <button
      type='button'
      aria-label={ariaLabel}
      aria-expanded={controls ? isActive : undefined}
      aria-controls={controls}
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

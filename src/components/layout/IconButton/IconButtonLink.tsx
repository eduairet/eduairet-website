import { ReactNode } from 'react';
import styles from './IconButton.module.scss';
import SvgWrapper from '../SvgWrapper/SvgWrapper';
import Link from 'next/link';

interface IProps {
  children: ReactNode;
  href: string;
  external?: boolean;
}

export default function IconButtonLink({
  children,
  href,
  external = false,
}: IProps) {
  if (external) {
    return (
      <a href={href} target='_blank' className={styles['icon-button']}>
        <SvgWrapper>{children}</SvgWrapper>
      </a>
    );
  }
  return (
    <Link href={href} className={styles['icon-button']}>
      {children}
    </Link>
  );
}

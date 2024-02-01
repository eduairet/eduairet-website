import { ReactNode } from 'react';
import styles from './IconButton.module.scss';
import SvgWrapper from '../SvgWrapper';
import Link from 'next/link';
import IconButtonScreenTitle from './IconButtonScreenTitle';

interface IProps {
  children: ReactNode;
  href: string;
  title?: string;
  ariaLabel?: string;
  external?: boolean;
}

export default function IconButtonLink({
  children,
  href,
  ariaLabel = 'Link',
  title = 'Link',
  external = false,
}: IProps) {
  title = title || 'Link';

  if (external) {
    return (
      <a
        aria-label={ariaLabel}
        href={href}
        target='_blank'
        className={styles['icon-button']}
      >
        <SvgWrapper>{children}</SvgWrapper>
        <IconButtonScreenTitle title={title} />
      </a>
    );
  }
  return (
    <Link aria-label={ariaLabel} href={href} className={styles['icon-button']}>
      <SvgWrapper>{children}</SvgWrapper>
      <IconButtonScreenTitle title={title} />
    </Link>
  );
}

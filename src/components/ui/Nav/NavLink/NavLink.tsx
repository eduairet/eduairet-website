'use client';

import { memo, useContext } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './NavLink.module.scss';
import { LanguageContext } from '@/store/LanguageProvider';

interface IProps {
  href: string;
  text: string;
  isLangLink?: boolean;
}

function NavLink({ href, text, isLangLink = false }: IProps) {
  const pathname = usePathname();
  const { locale } = useContext(LanguageContext);

  const isActive = () => {
    if (isLangLink) return href.includes(locale);
    return pathname == href;
  };

  const hrefState = isLangLink
    ? `${href}${pathname.replace(locale, '').replace(/\/{2,}/g, '/')}`
    : href;

  return (
    <li className={styles['nav-link']}>
      <Link className={isActive() ? styles.active : ''} href={hrefState}>
        {text}
      </Link>
    </li>
  );
}

export default memo(NavLink);

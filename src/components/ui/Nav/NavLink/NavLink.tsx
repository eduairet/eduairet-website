'use client';

import { memo, useContext } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './NavLink.module.scss';
import { LanguageContext } from '@/store/LanguageProvider';
import usePrefetchOnIntent from '@/hooks/usePrefetchOnIntent';

interface IProps {
  href: string;
  text: string;
  lang?: string;
  isLangLink?: boolean;
}

function NavLink({ href, text, lang, isLangLink = false }: IProps) {
  const pathname = usePathname();
  const { locale } = useContext(LanguageContext);

  const isActive = () => {
    if (isLangLink) return href.includes(locale);
    return pathname == href;
  };

  const hrefState = isLangLink
    ? `${href}${pathname.replace(locale, '')}`
        .replace(/\/{2,}/g, '/')
        .replace(/(.)\/$/, '$1')
    : href;
  const prefetchOnIntent = usePrefetchOnIntent(hrefState);

  return (
    <li className={styles['nav-link']}>
      <Link
        {...prefetchOnIntent}
        className={isActive() ? styles.active : ''}
        href={hrefState}
        lang={lang}
        hrefLang={lang}
        aria-current={isActive() ? 'page' : undefined}
      >
        {text}
      </Link>
    </li>
  );
}

export default memo(NavLink);

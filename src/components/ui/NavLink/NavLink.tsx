'use client';

import { useContext } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './NavLink.module.scss';
import { LanguageContext } from '@/store/LanguageProvider';

interface IProps {
  href: string;
  text: string;
  isLangLink?: boolean;
}

export default function NavLink({ href, text, isLangLink = false }: IProps) {
  const pathname = usePathname();
  const { locale } = useContext(LanguageContext);

  const isActive = () => {
    if (isLangLink) return href.includes(locale);
    return pathname == href;
  };

  const setHref = () => {
    if (!isLangLink) return href;
    const newHref = pathname.replace(locale, '').replace(/\/{2,}/g, '/');
    return `${href}${newHref}`;
  };

  return (
    <li className={styles['nav-link']}>
      <Link href={setHref()} className={isActive() ? styles.active : ''}>
        {text}
      </Link>
    </li>
  );
}

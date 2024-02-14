'use client';

import { memo, useContext } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './NavLink.module.scss';
import { LanguageContext } from '@/store/LanguageProvider';
import useAnimatedRouter from '@/hooks/useAnimatedRouter';

interface IProps {
  href: string;
  text: string;
  isLangLink?: boolean;
}

function NavLink({ href, text, isLangLink = false }: IProps) {
  const pathname = usePathname();
  const { animatedRoute } = useAnimatedRouter();
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
      <Link
        className={isActive() ? styles.active : ''}
        href={setHref()}
        onClick={() => {
          animatedRoute(setHref());
        }}
        passHref
      >
        {text}
      </Link>
    </li>
  );
}

export default memo(NavLink);

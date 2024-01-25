'use client';

import { usePathname, useParams } from 'next/navigation';
import Link from 'next/link';
import styles from './NavLink.module.scss';

interface IProps {
  href: string;
  text: string;
  isLangLink?: boolean;
}

export default function NavLink({ href, text, isLangLink = false }: IProps) {
  const pathname = usePathname();
  const params = useParams();

  const isActive = () => {
    if (isLangLink) return href.includes(params.locale as string);
    return pathname == href;
  };

  const setHref = () => {
    if (!isLangLink) return href;
    const newHref = pathname
      .replace(params.locale as string, '')
      .replace(/\/{2,}/g, '/');
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

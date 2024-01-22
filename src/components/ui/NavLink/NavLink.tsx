'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './NavLink.module.scss';

interface IProps {
  href: string;
  text: string;
}

export default function NavLink({ href, text }: IProps) {
  const pathname = usePathname();

  return (
    <li className={styles['nav-link']}>
      <Link href={href} className={pathname == href ? styles.active : ''}>
        {text}
      </Link>
    </li>
  );
}

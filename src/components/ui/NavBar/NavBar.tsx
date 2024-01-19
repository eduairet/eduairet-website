'use client';

import { usePathname } from 'next/navigation';
import styles from './NavBar.module.scss';
import Link from 'next/link';
import ThemeButton from '../ThemeButton/ThemeButton';

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      {/*<ul className={styles.actions}>
        <li>
          <Link href='/' className={pathname == '/' ? 'active' : ''}>
            Home
          </Link>
        </li>
      </ul>*/}
      <div className={styles.actions}>
        <ThemeButton />
      </div>
    </nav>
  );
}

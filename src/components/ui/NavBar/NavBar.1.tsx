'use client';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import styles from './NavBar.module.scss';
import { Lang } from '@/models';
import NavLink from '../NavLink/NavLink';

export default function NavBar({ lang }: { lang: Lang }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      <nav className={styles.nav}>
        <ul className={styles.actions}>
          <NavLink href={`/${lang}`} text='Home' />
          <NavLink
            href={`/${lang}/contact`}
            text={lang === Lang.SP ? 'Contacto' : 'Contact'}
          />
        </ul>
        <ul className={styles.actions}>
          <li className={styles.languages}>
            <button
              className={lang === Lang.EN ? styles.active : ''}
              onClick={() => {
                return router.push(pathname.replace(Lang.SP, Lang.EN));
              }}
            >
              {lang == Lang.EN ? 'ENG' : 'ING'}
            </button>
            <button
              className={lang === Lang.SP ? styles.active : ''}
              onClick={() => router.push(pathname.replace(Lang.EN, Lang.SP))}
            >
              {lang == Lang.EN ? 'SPN' : 'ESP'}
            </button>
          </li>
        </ul>
      </nav>
      <div className={styles.divider}></div>
    </>
  );
}

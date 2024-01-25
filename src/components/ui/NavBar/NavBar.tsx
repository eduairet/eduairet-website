import styles from './NavBar.module.scss';
import { Lang } from '@/models';
import { getDictionary } from '@/app/[locale]/dictionaries';
import NavLink from '../NavLink/NavLink';

interface IProps {
  lang: Lang;
  pathname: string;
}

export default async function NavBar({ lang, pathname }: IProps) {
  const content = await getDictionary(lang);

  return (
    <>
      <nav className={styles.nav}>
        <ul className={styles.actions}>
          <NavLink href={`/${lang}`} text={content.nav.home} />
          <NavLink href={`/${lang}/contact`} text={content.nav.contact} />
        </ul>
        <ul className={styles.actions}>
          <NavLink
            href={pathname.replace('es', 'en')}
            text={content.nav.langs.en}
            isLangLink
          />
          <NavLink
            href={pathname.replace('en', 'es')}
            text={content.nav.langs.es}
            isLangLink
          />
        </ul>
      </nav>
      <div className={styles.divider}></div>
    </>
  );
}

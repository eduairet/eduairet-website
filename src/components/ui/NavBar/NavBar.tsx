import styles from './NavBar.module.scss';
import { getDictionary } from '@/app/[locale]/dictionaries';
import { Lang } from '@/models';
import NavLink from '../NavLink/NavLink';
import NavMainMenu from '../NavMainMenu';
import NavLangMenu from '../NavLangMenu';

interface IProps {
  lang: Lang;
}

export default async function NavBar({ lang }: IProps) {
  const content = await getDictionary(lang);

  return (
    <>
      <nav className={styles.nav}>
        <NavMainMenu>
          <NavLink href={`/${lang}`} text={content.nav.home} />
          <NavLink href={`/${lang}/contact`} text={content.nav.contact} />
        </NavMainMenu>
        <NavLangMenu />
      </nav>
      <div className={styles.divider}></div>
    </>
  );
}

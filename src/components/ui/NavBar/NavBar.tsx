import { headers } from 'next/headers';
import styles from './NavBar.module.scss';
import { getDictionary } from '@/app/[locale]/dictionaries';
import { Lang } from '@/models';
import NavLink from '../NavLink/NavLink';
import GitHubIcon from '@/components/svg/GitHubIcon';

interface IProps {
  lang: Lang;
}

export default async function NavBar({ lang }: IProps) {
  const content = await getDictionary(lang);

  return (
    <>
      <nav className={styles.nav}>
        <ul className={styles.actions}>
          <NavLink href={`/${lang}`} text={content.nav.home} />
          <NavLink href={`/${lang}/contact`} text={content.nav.contact} />
          <GitHubIcon />
        </ul>
        <ul className={styles.actions}>
          <NavLink href={'/en'} text={content.nav.langs.en} isLangLink />
          <NavLink href={'/es'} text={content.nav.langs.es} isLangLink />
        </ul>
      </nav>
      <div className={styles.divider}></div>
    </>
  );
}

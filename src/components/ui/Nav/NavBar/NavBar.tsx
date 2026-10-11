import styles from './NavBar.module.scss';
import { Lang } from '@/models';
import { getDictionary } from '@/app/[locale]/dictionaries';
import NavMainMenu from '@/components/ui/Nav/NavMainMenu';
import NavLangMenu from '@/components/ui/Nav/NavLangMenu';
import EatHomeButton from '@/components/brand/EatHomeButton/EatHomeButton';

interface IProps {
  locale: Lang;
}

// Each width renders one logo and one set of menus; CSS hides the other.
export default async function NavBar({ locale }: IProps) {
  const content = await getDictionary(locale);

  return (
    <div className={styles['nav-wrapper']}>
      <EatHomeButton locale={locale} className={styles['wide-only']} />
      <nav className={styles.nav}>
        <NavMainMenu
          className={styles['main-menu']}
          themeLabel={content.footer.theme.text}
        />
        <EatHomeButton
          locale={locale}
          compact
          className={styles['phone-only']}
        />
        <NavLangMenu className={styles['wide-only']} />
      </nav>
    </div>
  );
}

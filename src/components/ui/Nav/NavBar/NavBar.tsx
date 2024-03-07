import styles from './NavBar.module.scss';
import { Lang } from '@/models';
import NavMainMenu from '@/components/ui/Nav/NavMainMenu';
import NavLangMenu from '@/components/ui/Nav/NavLangMenu';
import EatHomeButton from '@/components/brand/EatHomeButton/EatHomeButton';

interface IProps {
  locale: Lang;
}

export default async function NavBar({ locale }: IProps) {
  return (
    <div className={styles['nav-wrapper']}>
      <EatHomeButton locale={locale} />
      <nav className={styles.nav}>
        <NavMainMenu />
        <NavLangMenu />
      </nav>
    </div>
  );
}

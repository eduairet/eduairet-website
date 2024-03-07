import styles from './NavBar.module.scss';
import NavMainMenu from '@/components/ui/Nav/NavMainMenu';
import NavLangMenu from '@/components/ui/Nav/NavLangMenu';

export default async function NavBar() {
  return (
    <nav className={styles.nav}>
      <NavMainMenu />
      <NavLangMenu />
    </nav>
  );
}

import styles from './NavBar.module.scss';
import NavMainMenu from '@/components/ui/NavMainMenu';
import NavLangMenu from '@/components/ui/NavLangMenu';

export default async function NavBar() {
  return (
    <nav className={styles.nav}>
      <NavMainMenu />
      <NavLangMenu />
    </nav>
  );
}

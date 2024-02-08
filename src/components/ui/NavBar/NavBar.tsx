import styles from './NavBar.module.scss';
import NavMainMenu from '../NavMainMenu';
import NavLangMenu from '../NavLangMenu';

export default async function NavBar() {
  return (
    <>
      <nav className={styles.nav}>
        <NavMainMenu />
        <NavLangMenu />
      </nav>
      <div className={styles.divider}></div>
    </>
  );
}

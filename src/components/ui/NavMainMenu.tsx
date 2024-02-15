'use client';

import { useContext } from 'react';
import { BackdropType } from '@/models';
import { BackdropContext } from '@/store/BackdropProvider';
import { LanguageContext } from '@/store/LanguageProvider';
import NavLink from './NavLink/NavLink';
import NavDropdown from './NavDropdown/NavDropdown';
import HamburgerButton from './HamburgerButton/HamburgerButton';

export default function NavMainMenu() {
  const { locale, content, isLoading } = useContext(LanguageContext);
  const {
    backdropState: { navMainBackdrop },
    setBackdrop,
  } = useContext(BackdropContext);

  const toggleMenu = () => {
    if (!navMainBackdrop) setBackdrop(BackdropType.OPEN_NAV_MAIN);
    else setBackdrop(BackdropType.CLOSE_NAV);
  };

  if (isLoading) return null;

  return (
    <div>
      <HamburgerButton isActive={navMainBackdrop} onClick={toggleMenu} />
      <NavDropdown isOpen={navMainBackdrop} onClick={toggleMenu}>
        <NavLink href={`/${locale}`} text={content.nav.home} />
        <NavLink href={`/${locale}/contact`} text={content.nav.contact} />
      </NavDropdown>
    </div>
  );
}

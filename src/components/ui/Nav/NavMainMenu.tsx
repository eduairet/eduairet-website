'use client';

import { useContext } from 'react';
import { BackdropType } from '@/models';
import { BackdropContext } from '@/store/BackdropProvider';
import { LanguageContext } from '@/store/LanguageProvider';
import NavLink from './NavLink/NavLink';
import NavDropdown from './NavDropdown/NavDropdown';
import HamburgerButton from '../Buttons/HamburgerButton/HamburgerButton';
import { PageUrls } from '@/utils/constants';

export default function NavMainMenu() {
  const { locale, content } = useContext(LanguageContext);
  const {
    backdropState: { navMainBackdrop },
    setBackdrop,
  } = useContext(BackdropContext);

  const toggleMenu = () => {
    if (!navMainBackdrop) setBackdrop(BackdropType.OPEN_NAV_MAIN);
    else setBackdrop(BackdropType.CLOSE_NAV);
  };

  return (
    <div>
      <HamburgerButton isActive={navMainBackdrop} onClick={toggleMenu} />
      <NavDropdown isOpen={navMainBackdrop} onClick={toggleMenu}>
        <NavLink href={PageUrls.home_(locale)} text={content.nav.home} />
        <NavLink href={PageUrls.contact_(locale)} text={content.nav.contact} />
      </NavDropdown>
    </div>
  );
}

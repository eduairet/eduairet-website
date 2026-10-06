'use client';

import { useContext } from 'react';
import { BackdropType } from '@/models';
import { BackdropContext } from '@/store/BackdropProvider';
import { LanguageContext } from '@/store/LanguageProvider';
import useNavMenu from '@/hooks/useNavMenu';
import NavLink from './NavLink/NavLink';
import NavDropdown from './NavDropdown/NavDropdown';
import HamburgerButton from '../Buttons/HamburgerButton/HamburgerButton';
import { PageUrls } from '@/utils/constants';

const MENU_ID = 'nav-main-menu';

export default function NavMainMenu() {
  const { locale, content } = useContext(LanguageContext);
  const {
    backdropState: { navMainBackdrop },
    setBackdrop,
  } = useContext(BackdropContext);
  const { wrapperProps, onLinkClick } = useNavMenu(navMainBackdrop, () =>
    setBackdrop(BackdropType.CLOSE_NAV)
  );

  const toggleMenu = () => {
    if (!navMainBackdrop) setBackdrop(BackdropType.OPEN_NAV_MAIN);
    else setBackdrop(BackdropType.CLOSE_NAV);
  };

  return (
    <div {...wrapperProps}>
      <HamburgerButton
        isActive={navMainBackdrop}
        controls={MENU_ID}
        onClick={toggleMenu}
      />
      <NavDropdown id={MENU_ID} isOpen={navMainBackdrop} onClick={onLinkClick}>
        <NavLink href={PageUrls.home_(locale)} text={content.nav.home} />
        <NavLink href={PageUrls.contact_(locale)} text={content.nav.contact} />
      </NavDropdown>
    </div>
  );
}

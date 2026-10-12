'use client';

import { useContext } from 'react';
import styles from './NavMainMenu.module.scss';
import { BackdropType } from '@/models';
import { BackdropContext } from '@/store/BackdropProvider';
import { LanguageContext } from '@/store/LanguageProvider';
import useNavMenu from '@/hooks/useNavMenu';
import NavLink from './NavLink/NavLink';
import NavLangLinks from './NavLangLinks';
import NavDropdown from './NavDropdown/NavDropdown';
import HamburgerButton from '../Buttons/HamburgerButton/HamburgerButton';
import ThemeButton from '../Buttons/ThemeButton/ThemeButton';
import { PageUrls } from '@/utils/constants';

const MENU_ID = 'nav-main-menu';

interface IProps {
  themeLabel: string;
  className?: string;
}

export default function NavMainMenu({ themeLabel, className }: IProps) {
  const { locale, content } = useContext(LanguageContext);
  const {
    backdropState: { navMainBackdrop },
    setBackdrop,
  } = useContext(BackdropContext);
  const { wrapperProps, onLinkClick, isModal } = useNavMenu(
    navMainBackdrop,
    () => setBackdrop(BackdropType.CLOSE_NAV),
    true
  );

  const toggleMenu = () => {
    if (!navMainBackdrop) setBackdrop(BackdropType.OPEN_NAV_MAIN);
    else setBackdrop(BackdropType.CLOSE_NAV);
  };

  return (
    <div
      {...wrapperProps}
      className={className}
      role={isModal ? 'dialog' : undefined}
      aria-modal={isModal || undefined}
      aria-label={isModal ? content.nav.menu : undefined}
    >
      <HamburgerButton
        isActive={navMainBackdrop}
        controls={MENU_ID}
        onClick={toggleMenu}
      />
      <NavDropdown
        id={MENU_ID}
        isOpen={navMainBackdrop}
        fullScreenOnPhone
        onClick={onLinkClick}
      >
        <NavLink href={PageUrls.home_(locale)} text={content.nav.home} />
        <NavLink href={PageUrls.contact_(locale)} text={content.nav.contact} />
        <li className={styles.languages}>
          <ul aria-label={content.buttons.langsButton.title}>
            <NavLangLinks />
          </ul>
        </li>
        <li className={styles.theme}>
          <span>{themeLabel}</span>
          <ThemeButton />
        </li>
      </NavDropdown>
    </div>
  );
}

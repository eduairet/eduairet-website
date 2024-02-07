'use client';

import { useContext, ReactNode } from 'react';
import { BackdropContext } from '@/store/BackdropProvider';
import HamburgerButton from './HamburgerButton/HamburgerButton';
import { BackdropType } from '@/models';
import NavDropdown from './NavDropdown/NavDropdown';

interface IProps {
  children: ReactNode;
}

export default function NavMainMenu({ children }: IProps) {
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
      <NavDropdown isOpen={navMainBackdrop}>{children}</NavDropdown>
    </div>
  );
}

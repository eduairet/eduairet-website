'use client';

import { useContext } from 'react';
import { BackdropContext } from '@/store/BackdropProvider';
import { BackdropType } from '@/models';
import useNavMenu from '@/hooks/useNavMenu';
import GlobeButton from '@/components/ui/Buttons/GlobeButton';
import NavLangLinks from './NavLangLinks';
import NavDropdown from './NavDropdown/NavDropdown';

const MENU_ID = 'nav-lang-menu';

interface IProps {
  className?: string;
}

export default function NavLangMenu({ className }: IProps) {
  const {
    backdropState: { navLangBackdrop },
    setBackdrop,
  } = useContext(BackdropContext);
  const { wrapperProps, onLinkClick } = useNavMenu(navLangBackdrop, () =>
    setBackdrop(BackdropType.CLOSE_NAV)
  );

  const toggleLanguages = () => {
    if (!navLangBackdrop) setBackdrop(BackdropType.OPEN_NAV_LANG);
    else setBackdrop(BackdropType.CLOSE_NAV);
  };

  return (
    <div {...wrapperProps} className={className}>
      <GlobeButton
        isActive={navLangBackdrop}
        controls={MENU_ID}
        onClick={toggleLanguages}
      />
      <NavDropdown id={MENU_ID} isOpen={navLangBackdrop} onClick={onLinkClick}>
        <NavLangLinks />
      </NavDropdown>
    </div>
  );
}

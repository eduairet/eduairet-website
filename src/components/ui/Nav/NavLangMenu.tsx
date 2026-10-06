'use client';

import { useContext } from 'react';
import { LanguageContext } from '@/store/LanguageProvider';
import { BackdropContext } from '@/store/BackdropProvider';
import { BackdropType } from '@/models';
import { PageUrls } from '@/utils/constants';
import useNavMenu from '@/hooks/useNavMenu';
import GlobeButton from '@/components/ui/Buttons/GlobeButton';
import NavLink from './NavLink/NavLink';
import NavDropdown from './NavDropdown/NavDropdown';

const MENU_ID = 'nav-lang-menu';

export default function NavLangMenu() {
  const { content } = useContext(LanguageContext);
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
    <div {...wrapperProps}>
      <GlobeButton
        isActive={navLangBackdrop}
        controls={MENU_ID}
        onClick={toggleLanguages}
      />
      <NavDropdown id={MENU_ID} isOpen={navLangBackdrop} onClick={onLinkClick}>
        <NavLink
          href={PageUrls.locale.en}
          text={content.nav.langs.en}
          lang='en'
          isLangLink
        />
        <NavLink
          href={PageUrls.locale.es}
          text={content.nav.langs.es}
          lang='es'
          isLangLink
        />
      </NavDropdown>
    </div>
  );
}

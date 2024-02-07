'use client';

import { useContext } from 'react';
import { LanguageContext } from '@/store/LanguageProvider';
import { BackdropContext } from '@/store/BackdropProvider';
import NavLink from './NavLink/NavLink';
import GlobeButton from '@/components/ui/GlobeButton';
import { BackdropType } from '@/models';
import NavDropdown from './NavDropdown/NavDropdown';

export default function NavLangMenu() {
  const { content } = useContext(LanguageContext);
  const {
    backdropState: { navLangBackdrop },
    setBackdrop,
  } = useContext(BackdropContext);

  const openLanguages = () => {
    if (!navLangBackdrop) setBackdrop(BackdropType.OPEN_NAV_LANG);
    else setBackdrop(BackdropType.CLOSE_NAV);
  };

  return (
    <div>
      <GlobeButton isActive={navLangBackdrop} onClick={openLanguages} />
      <NavDropdown isOpen={navLangBackdrop}>
        <NavLink href={'/en'} text={content.nav.langs.en} isLangLink />
        <NavLink href={'/es'} text={content.nav.langs.es} isLangLink />
      </NavDropdown>
    </div>
  );
}

'use client';

import { useContext } from 'react';
import { LanguageContext } from '@/store/LanguageProvider';
import { BackdropContext } from '@/store/BackdropProvider';
import { BackdropType } from '@/models';
import GlobeButton from '@/components/ui/GlobeButton';
import NavLink from './NavLink/NavLink';
import NavDropdown from './NavDropdown/NavDropdown';

export default function NavLangMenu() {
  const { content } = useContext(LanguageContext);
  const {
    backdropState: { navLangBackdrop },
    setBackdrop,
  } = useContext(BackdropContext);

  const toggleLanguages = () => {
    if (!navLangBackdrop) setBackdrop(BackdropType.OPEN_NAV_LANG);
    else setBackdrop(BackdropType.CLOSE_NAV);
  };

  return (
    <div>
      <GlobeButton isActive={navLangBackdrop} onClick={toggleLanguages} />
      <NavDropdown isOpen={navLangBackdrop} onClick={toggleLanguages}>
        <NavLink href={'/en'} text={content.nav.langs.en} isLangLink />
        <NavLink href={'/es'} text={content.nav.langs.es} isLangLink />
      </NavDropdown>
    </div>
  );
}

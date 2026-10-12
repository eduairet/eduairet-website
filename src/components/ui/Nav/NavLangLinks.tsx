'use client';

import { useContext } from 'react';
import { LanguageContext } from '@/store/LanguageProvider';
import { PageUrls } from '@/utils/constants';
import NavLink from './NavLink/NavLink';

export default function NavLangLinks() {
  const { content } = useContext(LanguageContext);

  return (
    <>
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
    </>
  );
}

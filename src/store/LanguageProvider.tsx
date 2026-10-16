'use client';

import { createContext, ReactNode, useEffect } from 'react';
import { Dictionary, Lang, UiContent } from '@/models';
import { localeSwitched } from '@/utils/client/localeSwitch';

interface LanguageContextProps {
  locale: Lang;
  content: UiContent;
}

export const LanguageContext = createContext<LanguageContextProps>({
  locale: 'en',
  content: new Dictionary(),
});

interface IProps extends LanguageContextProps {
  children: ReactNode;
}

// The layout passes the current locale's UI strings, so neither dictionary
// is bundled into client code.
export const LanguageProvider = ({ locale, content, children }: IProps) => {
  // Ends a language switch's view transition once the new locale renders.
  useEffect(localeSwitched, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, content }}>
      {children}
    </LanguageContext.Provider>
  );
};

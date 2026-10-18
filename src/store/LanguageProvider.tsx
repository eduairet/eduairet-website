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

// The layout passes this locale's strings, so neither dictionary ships to the client.
export const LanguageProvider = ({ locale, content, children }: IProps) => {
  // Ends a language switch's view transition once the new locale renders.
  useEffect(localeSwitched, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, content }}>
      {children}
    </LanguageContext.Provider>
  );
};

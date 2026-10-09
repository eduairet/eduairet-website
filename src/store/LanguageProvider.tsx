'use client';

import { createContext, ReactNode } from 'react';
import { Dictionary, Lang, UiContent } from '@/models';

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
export const LanguageProvider = ({ locale, content, children }: IProps) => (
  <LanguageContext.Provider value={{ locale, content }}>
    {children}
  </LanguageContext.Provider>
);

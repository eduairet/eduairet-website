'use client';

import { createContext, ReactNode } from 'react';
import useLanguage from '@/hooks/useLanguage';
import { Dictionary, Lang } from '@/models';

interface LanguageContextProps {
  locale: Lang;
  content: Dictionary;
}

export const LanguageContext = createContext<LanguageContextProps>({
  locale: 'en',
  content: new Dictionary(),
});

interface IProps {
  children: ReactNode;
}
export const LanguageProvider = ({ children }: IProps) => {
  const { locale, content } = useLanguage();

  return (
    <LanguageContext.Provider value={{ locale, content }}>
      {children}
    </LanguageContext.Provider>
  );
};

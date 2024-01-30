'use client';

import { createContext, ReactNode } from 'react';
import useLanguage from '@/hooks/useLanguage';
import { LanguageClientContent } from '@/models';

interface LanguageContextProps {
  locale: string;
  content: LanguageClientContent;
}

export const LanguageContext = createContext<LanguageContextProps>({
  locale: '',
  content: new LanguageClientContent(),
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

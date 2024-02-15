'use client';

import { createContext, ReactNode } from 'react';
import useLanguage from '@/hooks/useLanguage';
import { Dictionary, Lang } from '@/models';

interface LanguageContextProps {
  locale: Lang;
  isLoading: boolean;
  content: Dictionary;
}

export const LanguageContext = createContext<LanguageContextProps>({
  locale: 'en',
  isLoading: false,
  content: new Dictionary(),
});

interface IProps {
  children: ReactNode;
}
export const LanguageProvider = ({ children }: IProps) => {
  const { locale, isLoading, content } = useLanguage();

  return (
    <LanguageContext.Provider value={{ locale, isLoading, content }}>
      {children}
    </LanguageContext.Provider>
  );
};

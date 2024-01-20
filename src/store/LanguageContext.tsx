'use client';

import { createContext, useState, ReactNode, useEffect } from 'react';
import { Lang } from '@/models';

interface ILanguageContext {
  language: Lang;
  updateLanguage: (newLanguage: Lang) => void;
}

export const LanguageContext = createContext<ILanguageContext>({
  language: Lang.EN,
  updateLanguage: () => {},
});

interface IProps {
  children?: ReactNode;
}

export const LanguageProvider = (props: IProps) => {
  const [language, setLanguage] = useState<Lang>(Lang.EN);

  const updateLanguage = (newLanguage: Lang) => {
    setLanguage(newLanguage);
  };

  useEffect(() => {
    console.log('LangProvider useEffect');
    const preferredLanguage =
      document.documentElement.lang === 'en' ? Lang.EN : Lang.SP;
  }, []);

  return (
    <LanguageContext.Provider value={{ language, updateLanguage }}>
      {props.children}
    </LanguageContext.Provider>
  );
};

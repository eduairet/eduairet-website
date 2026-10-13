import { ReactNode } from 'react';
import type { Lang, UiContent } from '@/models';
import { LanguageProvider } from './LanguageProvider';
import { BackdropProvider } from './BackdropProvider';
import { ToastProvider } from './ToastProvider';

interface IProps {
  locale: Lang;
  content: UiContent;
  children: ReactNode;
}

export default function StoreProvider({ locale, content, children }: IProps) {
  return (
    <LanguageProvider locale={locale} content={content}>
      <BackdropProvider>
        <ToastProvider>{children}</ToastProvider>
      </BackdropProvider>
    </LanguageProvider>
  );
}

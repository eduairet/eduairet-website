import { ReactNode } from 'react';
import { LanguageProvider } from './LanguageProvider';
import { BackdropProvider } from './BackdropProvider';

interface IProps {
  children: ReactNode;
}

export default function StoreProvider({ children }: IProps) {
  return (
    <LanguageProvider>
      <BackdropProvider>{children}</BackdropProvider>
    </LanguageProvider>
  );
}

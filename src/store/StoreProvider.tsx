import { ReactNode } from 'react';
import { LanguageProvider } from './LanguageProvider';

interface IProps {
  children: ReactNode;
}

export default function StoreProvider({ children }: IProps) {
  return <LanguageProvider>{children}</LanguageProvider>;
}

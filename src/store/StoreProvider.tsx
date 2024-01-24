import { ReactNode } from 'react';
import { ThemeProvider } from './ThemeContext';

interface IProps {
  children: ReactNode;
}

export default function StoreProvider({ children }: IProps) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

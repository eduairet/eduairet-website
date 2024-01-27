import { ReactNode } from 'react';

interface IProps {
  children: ReactNode;
}

export default function StoreProvider({ children }: IProps) {
  return <>{children}</>;
}

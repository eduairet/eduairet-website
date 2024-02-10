import { ReactNode } from 'react';

interface IProps {
  children: ReactNode;
}

export default function BodyWrapper({ children }: IProps) {
  return <body>{children}</body>;
}

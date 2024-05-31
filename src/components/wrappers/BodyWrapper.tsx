import { ReactNode } from 'react';

interface IProps {
  children: ReactNode;
  hasSketch?: boolean;
}

export default function BodyWrapper({ children }: IProps) {
  // TODO Add {hasSketch && <Art />} When performance issues are addressed
  return <body>{children}</body>;
}

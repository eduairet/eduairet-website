import { ReactNode } from 'react';
import Art from '@/components/art/Art';

interface IProps {
  children: ReactNode;
  hasSketch?: boolean;
}

export default function BodyWrapper({ children, hasSketch = true }: IProps) {
  return (
    <body>
      {hasSketch && <Art />}
      {children}
    </body>
  );
}

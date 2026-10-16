import { ReactNode, ViewTransition } from 'react';

interface IProps {
  children: ReactNode;
}

// In each page, not the layout: layouts never enter or exit. Styles: _global.scss.
export default function PageTransition({ children }: IProps) {
  return (
    <ViewTransition enter='page-enter' exit='page-exit' default='none'>
      {children}
    </ViewTransition>
  );
}

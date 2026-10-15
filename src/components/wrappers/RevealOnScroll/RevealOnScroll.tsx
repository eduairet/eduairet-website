'use client';

import { ReactNode, useRef } from 'react';
import { useReveal } from './useReveal';

interface IProps {
  className: string;
  children: ReactNode;
}

export default function RevealOnScroll({ className, children }: IProps) {
  const blockRef = useRef<HTMLDivElement>(null);
  useReveal(blockRef);

  return (
    <div ref={blockRef} className={className}>
      {children}
    </div>
  );
}

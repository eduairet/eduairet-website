'use client';

import { ReactNode, useEffect, useRef } from 'react';

const HEIGHT_PROPERTY = '--footer-height';

interface IProps {
  className: string;
  children: ReactNode;
}

export default function MeasuredFooter({ className, children }: IProps) {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;
    const root = document.documentElement;
    const observer = new ResizeObserver(([entry]) =>
      root.style.setProperty(
        HEIGHT_PROPERTY,
        `${entry.borderBoxSize[0].blockSize}px`
      )
    );
    observer.observe(footer);
    return () => {
      observer.disconnect();
      root.style.removeProperty(HEIGHT_PROPERTY);
    };
  }, []);

  return (
    <footer ref={footerRef} className={className}>
      {children}
    </footer>
  );
}

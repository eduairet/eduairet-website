import { ReactNode } from 'react';

interface IProps {
  children: ReactNode;
  className?: string;
  width?: number;
  height?: number;
  ariaHidden?: boolean;
  focusable?: boolean;
}

export default function SvgWrapper({
  children,
  className,
  width = 100,
  height = 100,
  ariaHidden = true,
  focusable = false,
}: IProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden={ariaHidden}
      focusable={focusable}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlSpace='preserve'
      className={className || ''}
    >
      {children}
    </svg>
  );
}

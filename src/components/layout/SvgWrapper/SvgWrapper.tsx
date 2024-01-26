import { ReactNode } from 'react';
import styles from './SvgWrapper.module.scss';

interface IProps {
  children: ReactNode;
  className?: string;
  width?: number;
  height?: number;
}

export default function SvgWrapper({
  children,
  className,
  width = 100,
  height = 100,
}: IProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
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

import { ReactNode } from 'react';

interface IProps {
  href: string;
  newTab: string;
  className?: string;
  children: ReactNode;
}

export default function ExternalLink({
  href,
  newTab,
  className,
  children,
}: IProps) {
  return (
    <a
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      className={className}
    >
      {children}
      <span className='visually-hidden'> {newTab}</span>
    </a>
  );
}

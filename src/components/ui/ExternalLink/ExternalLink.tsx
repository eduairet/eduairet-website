import { ReactNode } from 'react';

interface IProps {
  href: string;
  newTab: string;
  children: ReactNode;
}

export default function ExternalLink({ href, newTab, children }: IProps) {
  return (
    <a href={href} target='_blank' rel='noopener noreferrer'>
      {children}
      <span className='visually-hidden'> {newTab}</span>
    </a>
  );
}

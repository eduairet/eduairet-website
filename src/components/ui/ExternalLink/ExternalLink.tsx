import { ReactNode } from 'react';

interface IProps {
  href: string;
  newTab: string;
  // Underlined, without the hover bar, for a link inside running text.
  inline?: boolean;
  children: ReactNode;
}

export default function ExternalLink({
  href,
  newTab,
  inline,
  children,
}: IProps) {
  return (
    <a
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      className={inline ? 'prose-link' : undefined}
    >
      {children}
      <span className='visually-hidden'> {newTab}</span>
    </a>
  );
}

import { ReactNode } from 'react';
import ParticleBackground from '@/components/art/ParticleBackground/ParticleBackground';
import { THEME_INIT_SCRIPT } from '@/utils/constants';

interface IProps {
  children: ReactNode;
}

export default function BodyWrapper({ children }: IProps) {
  return (
    // The script sets data-theme before React hydrates.
    <body suppressHydrationWarning>
      <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      <ParticleBackground />
      {children}
    </body>
  );
}

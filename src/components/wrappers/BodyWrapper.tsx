import { ReactNode } from 'react';
import ParticleBackground from '@/components/art/ParticleBackground/ParticleBackground';
import ThemeScript from '@/components/metadata/ThemeScript';

interface IProps {
  children: ReactNode;
}

export default function BodyWrapper({ children }: IProps) {
  return (
    <body suppressHydrationWarning>
      <ThemeScript />
      <ParticleBackground />
      {children}
    </body>
  );
}

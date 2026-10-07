import { ReactNode } from 'react';
import ParticleBackground from '@/components/art/ParticleBackground/ParticleBackground';

interface IProps {
  children: ReactNode;
}

export default function BodyWrapper({ children }: IProps) {
  return (
    <body>
      <ParticleBackground />
      {children}
    </body>
  );
}

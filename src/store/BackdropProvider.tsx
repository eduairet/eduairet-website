'use client';

import { createContext, ReactNode } from 'react';
import useBackdrop from '@/hooks/useBackdrop';
import { BackdropHook, BackdropState } from '@/models';

export const BackdropContext = createContext<BackdropHook>({
  backdropState: new BackdropState(),
  toggleBackdrop: () => {},
});

interface IProps {
  children: ReactNode;
}

export const BackdropProvider = ({ children }: IProps) => {
  const { backdropState, toggleBackdrop } = useBackdrop();

  return (
    <BackdropContext.Provider value={{ backdropState, toggleBackdrop }}>
      {children}
    </BackdropContext.Provider>
  );
};

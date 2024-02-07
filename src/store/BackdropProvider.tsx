'use client';

import { createContext, ReactNode } from 'react';
import useBackdrop from '@/hooks/useBackdrop';
import { BackdropHook, BackdropState } from '@/models';

export const BackdropContext = createContext<BackdropHook>({
  backdropState: new BackdropState(),
  setBackdrop: () => {},
});

interface IProps {
  children: ReactNode;
}

export const BackdropProvider = ({ children }: IProps) => {
  const { backdropState, setBackdrop } = useBackdrop();

  return (
    <BackdropContext.Provider value={{ backdropState, setBackdrop }}>
      {children}
    </BackdropContext.Provider>
  );
};

'use client';

import { useContext, ReactNode } from 'react';
import styles from './MainWrapper.module.scss';
import { BackdropType } from '@/models';
import { BackdropContext } from '@/store/BackdropProvider';
import NavBarBackdrop from '@/components/ui/NavBarBackdrop/NavBarBackdrop';

interface IProps {
  children: ReactNode;
}

export default function MainWrapper({ children }: IProps) {
  const { backdropState, toggleBackdrop } = useContext(BackdropContext);

  return (
    <>
      <main className={styles.main}>
        {backdropState.navBackdrop && (
          <NavBarBackdrop
            toggleBackdrop={() => toggleBackdrop(BackdropType.NAV)}
          />
        )}
        {children}
      </main>
    </>
  );
}

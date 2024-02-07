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
  const { backdropState, setBackdrop } = useContext(BackdropContext);

  return (
    <>
      {(backdropState.navMainBackdrop || backdropState.navLangBackdrop) && (
        <NavBarBackdrop
          closeBackdrop={() => setBackdrop(BackdropType.CLOSE_NAV)}
        />
      )}
      <main className={styles.main}>{children}</main>
    </>
  );
}

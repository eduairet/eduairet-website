'use client';

import { useContext, ReactNode, memo } from 'react';
import styles from './MainWrapper.module.scss';
import { BackdropType } from '@/models';
import { BackdropContext } from '@/store/BackdropProvider';
import { LanguageContext } from '@/store/LanguageProvider';
import NavBarBackdrop from '@/components/ui/NavBarBackdrop/NavBarBackdrop';
import Spinner from '@/components/ui/Spinner/Spinner';

interface IProps {
  children: ReactNode;
}

function MainWrapper({ children }: IProps) {
  const { backdropState, setBackdrop } = useContext(BackdropContext);
  const { isLoading } = useContext(LanguageContext);

  if (isLoading)
    return (
      <>
        <div className={styles.loading}>
          <Spinner />
        </div>
        <main className={[styles.main, styles.blurred].join(' ')}>
          {children}
        </main>
      </>
    );

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

export default memo(MainWrapper);

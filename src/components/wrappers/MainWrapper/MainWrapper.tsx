'use client';

import { useContext, ReactNode, memo, Suspense } from 'react';
import styles from './MainWrapper.module.scss';
import { BackdropType } from '@/models';
import { BackdropContext } from '@/store/BackdropProvider';
import NavBarBackdrop from '@/components/ui/Nav/NavBarBackdrop/NavBarBackdrop';
import Spinner from '@/components/ui/Spinner/Spinner';

interface IProps {
  children: ReactNode;
}

function MainWrapper({ children }: IProps) {
  const { backdropState, setBackdrop } = useContext(BackdropContext);

  const Loading = () => (
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
    <Suspense fallback={<Loading />}>
      {(backdropState.navMainBackdrop || backdropState.navLangBackdrop) && (
        <NavBarBackdrop
          closeBackdrop={() => setBackdrop(BackdropType.CLOSE_NAV)}
        />
      )}
      <main className={styles.main}>{children}</main>
    </Suspense>
  );
}

export default memo(MainWrapper);

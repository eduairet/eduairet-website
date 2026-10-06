'use client';

import { useContext, ReactNode, memo, Suspense } from 'react';
import styles from './MainWrapper.module.scss';
import { BackdropType } from '@/models';
import { BackdropContext } from '@/store/BackdropProvider';
import { LanguageContext } from '@/store/LanguageProvider';
import NavBarBackdrop from '@/components/ui/Nav/NavBarBackdrop/NavBarBackdrop';
import Spinner from '@/components/ui/Spinner/Spinner';

interface IProps {
  children: ReactNode;
}

// The blurred copy is only a backdrop for the spinner, so it is not a second
// <main> and is hidden from assistive technology and keyboard focus.
function Loading({ children }: IProps) {
  const { content } = useContext(LanguageContext);

  return (
    <>
      <div className={styles.loading} role='status'>
        <Spinner label={content.status.loading} />
      </div>
      <div
        className={[styles.main, styles.blurred].join(' ')}
        aria-hidden
        inert
      >
        {children}
      </div>
    </>
  );
}

function MainWrapper({ children }: IProps) {
  const { backdropState, setBackdrop } = useContext(BackdropContext);

  return (
    <Suspense fallback={<Loading>{children}</Loading>}>
      {(backdropState.navMainBackdrop || backdropState.navLangBackdrop) && (
        <NavBarBackdrop
          closeBackdrop={() => setBackdrop(BackdropType.CLOSE_NAV)}
        />
      )}
      <main id='main' className={styles.main}>
        {children}
      </main>
    </Suspense>
  );
}

export default memo(MainWrapper);

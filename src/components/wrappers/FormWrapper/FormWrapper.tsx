'use client';

import { FocusEventHandler, FormEventHandler, ReactNode, memo } from 'react';
import styles from './FormWrapper.module.scss';

interface IProps {
  children: ReactNode;
  errorMessage?: string;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onFocus?: FocusEventHandler<HTMLFormElement>;
}

function FormWrapper({ children, errorMessage, onSubmit, onFocus }: IProps) {
  // The status region is always rendered so screen readers announce an
  // error when it appears. noValidate lets our own errors replace the
  // browser's validation bubbles.
  return (
    <form
      className={styles.form}
      onSubmit={onSubmit}
      onFocus={onFocus}
      noValidate
    >
      {children}
      <p role='status' className={styles['submit-message']}>
        {errorMessage}
      </p>
    </form>
  );
}

export default memo(FormWrapper);

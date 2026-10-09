'use client';

import { FocusEventHandler, FormEventHandler, ReactNode, memo } from 'react';
import styles from './FormWrapper.module.scss';

interface IProps {
  children: ReactNode;
  submitMessage?: string;
  error?: boolean;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onFocus?: FocusEventHandler<HTMLFormElement>;
}

function FormWrapper({
  children,
  submitMessage,
  onSubmit,
  onFocus,
  error = false,
}: IProps) {
  // The status region is always rendered so screen readers announce the
  // message when it appears. noValidate lets our own errors replace the
  // browser's validation bubbles.
  return (
    <form
      className={styles.form}
      onSubmit={onSubmit}
      onFocus={onFocus}
      noValidate
    >
      {children}
      <p
        role='status'
        className={[styles['submit-message'], error ? styles.error : ''].join(
          ' '
        )}
      >
        {submitMessage}
      </p>
    </form>
  );
}

export default memo(FormWrapper);

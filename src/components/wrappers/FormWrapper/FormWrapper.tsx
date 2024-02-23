'use client';

import { FormEventHandler, ReactNode, memo } from 'react';
import styles from './FormWrapper.module.scss';

interface IProps {
  children: ReactNode;
  submitMessage?: string;
  error?: boolean;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

function FormWrapper({
  children,
  submitMessage,
  onSubmit,
  error = false,
}: IProps) {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      {children}
      {submitMessage && (
        <p
          className={[styles['submit-message'], error ? styles.error : ''].join(
            ' '
          )}
        >
          {submitMessage}
        </p>
      )}
    </form>
  );
}

export default memo(FormWrapper);

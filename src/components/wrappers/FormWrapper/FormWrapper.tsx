'use client';

import { FormEventHandler, ReactNode, memo } from 'react';
import styles from './FormWrapper.module.scss';

interface IProps {
  children: ReactNode;
  error?: string | null;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

function FormWrapper({ children, onSubmit, error = null }: IProps) {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      {children}
      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
}

export default memo(FormWrapper);

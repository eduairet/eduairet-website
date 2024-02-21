'use client';

import { ReactNode } from 'react';
import styles from './Button.module.scss';

interface IProps {
  children: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: () => void;
}

export default function Button({
  children,
  onClick = () => {},
  type = 'button',
  disabled = false,
}: IProps) {
  return (
    <button
      className={styles.button}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

'use client';

import { ReactNode } from 'react';
import styles from './ButtonWrapper.module.scss';

interface IProps {
  children: ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: () => void;
  props?: any;
}

export default function ButtonWrapper({
  children,
  className = '',
  onClick = () => {},
  type = 'button',
  disabled = false,
  props,
}: IProps) {
  return (
    <button
      className={[styles.button, className].join(' ')}
      type={type}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

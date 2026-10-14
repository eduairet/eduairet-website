import { ChangeEventHandler, ReactNode } from 'react';
import styles from './Checkbox.module.scss';

interface IProps {
  id: string;
  label: ReactNode;
  checked: boolean;
  required?: boolean;
  error?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

export default function Checkbox({
  id,
  label,
  checked,
  required,
  error,
  onChange,
}: IProps) {
  const errorId = `${id}-error`;

  return (
    <div className={styles['checkbox-wrapper']}>
      <div className={styles.field}>
        <input
          type='checkbox'
          id={id}
          checked={checked}
          required={required}
          className={[styles.checkbox, error ? styles.invalid : ''].join(' ')}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={onChange}
        />
        <label htmlFor={id}>{label}</label>
      </div>
      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}

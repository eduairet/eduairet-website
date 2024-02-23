'use client';

import { ChangeEventHandler, FocusEventHandler } from 'react';
import styles from './TextInput.module.scss';
import { TextInputType } from '@/models';
import useTextInput from '@/hooks/useTextInput';

interface IProps {
  id: string;
  label: string;
  type?: TextInputType;
  required?: boolean;
  value?: string;
  focused?: boolean;
  // eslint-disable-next-line unused-imports/no-unused-vars, no-unused-vars
  onChange: (value: string, focused: boolean, isValid: boolean) => void;
}

export default function TextInput({
  id,
  label,
  onChange,
  value = '',
  focused = false,
  required = true,
  type = 'text',
}: IProps) {
  const { isValid, errorMessage } = useTextInput(
    type,
    id as string,
    value,
    focused
  );

  const handleBlur: FocusEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    onChange(e.target.value, true, isValid);
  };

  const handleChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    onChange(e.target.value, true, isValid);
  };

  return (
    <div className={styles.wrapper}>
      <label
        className={[styles.label, !isValid ? styles.error : ''].join(' ')}
        htmlFor={id}
      >
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          className={[styles.textarea, !isValid ? styles.invalid : ''].join(
            ' '
          )}
          id={id}
          value={value}
          required={required}
          onBlur={handleBlur}
          onChange={handleChange}
        />
      ) : (
        <input
          className={[styles.input, !isValid ? styles.invalid : ''].join(' ')}
          id={id}
          type={type}
          value={value}
          required={required}
          onBlur={handleBlur}
          onChange={handleChange}
        />
      )}
      {!isValid && (
        <p className={[styles['input-info'], styles.error].join(' ')}>
          {errorMessage || 'Error'}
        </p>
      )}
    </div>
  );
}

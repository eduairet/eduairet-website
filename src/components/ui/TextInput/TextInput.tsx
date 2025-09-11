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
  minLength?: number;
  maxLength?: number;
  focused?: boolean;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string, focused: boolean, isValid: boolean) => void;
}

export default function TextInput({
  id,
  label,
  onChange,
  minLength,
  maxLength,
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

  const hasLengthValidation =
    typeof minLength === 'number' && typeof maxLength === 'number';

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
      <div className={styles['label-wrapper']}>
        <label
          className={[styles.label, !isValid ? styles.error : ''].join(' ')}
          htmlFor={id}
        >
          {`${label}${required ? '*' : ''}`}
        </label>
        {hasLengthValidation && (
          <span
            className={[styles.label, !isValid ? styles.error : ''].join(' ')}
          >{`${minLength} - ${maxLength}`}</span>
        )}
      </div>
      {type === 'textarea' ? (
        <textarea
          className={[styles.textarea, !isValid ? styles.invalid : ''].join(
            ' '
          )}
          id={id}
          value={value}
          minLength={minLength}
          maxLength={maxLength}
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
          minLength={minLength}
          maxLength={maxLength}
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
      {hasLengthValidation && focused && (
        <p
          className={[
            styles['input-info'],
            value.length < minLength || value.length > maxLength
              ? styles.error
              : '',
          ].join(' ')}
        >{`${value.length}/${maxLength}`}</p>
      )}
    </div>
  );
}

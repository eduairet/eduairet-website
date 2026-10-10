'use client';

import { ChangeEventHandler, FocusEventHandler } from 'react';
import styles from './TextInput.module.scss';
import { TextInputType } from '@/models';
import useTextInput, { getTextInputError } from '@/hooks/useTextInput';

interface IProps {
  id: string;
  label: string;
  type?: TextInputType;
  required?: boolean;
  value?: string;
  minLength?: number;
  maxLength?: number;
  focused?: boolean;
  hint?: string;
  autoComplete?: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string, focused: boolean, isValid: boolean) => void;
}

export default function TextInput({
  id,
  label,
  onChange,
  minLength,
  maxLength,
  hint,
  autoComplete,
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

  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = `${id}-error`;
  const describedBy =
    [!isValid ? errorId : null, hintId].filter(Boolean).join(' ') || undefined;

  // Validate the new value, not the one from the previous render.
  const report = (newValue: string) =>
    onChange(newValue, true, getTextInputError(type, newValue) === null);

  const handleBlur: FocusEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    report(e.target.value);
  };

  const handleChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    report(e.target.value);
  };

  const fieldProps = {
    id,
    value,
    minLength,
    maxLength,
    required,
    autoComplete,
    'aria-invalid': !isValid || undefined,
    'aria-describedby': describedBy,
    onBlur: handleBlur,
    onChange: handleChange,
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles['label-wrapper']}>
        <label
          className={[styles.label, !isValid ? styles.error : ''].join(' ')}
          htmlFor={id}
        >
          {label}
        </label>
        {hint && (
          <span
            id={hintId}
            className={[styles.label, !isValid ? styles.error : ''].join(' ')}
          >
            {hint}
          </span>
        )}
      </div>
      {type === 'textarea' ? (
        <textarea
          className={[styles.textarea, !isValid ? styles.invalid : ''].join(
            ' '
          )}
          {...fieldProps}
        />
      ) : (
        <input
          className={[styles.input, !isValid ? styles.invalid : ''].join(' ')}
          type={type}
          {...fieldProps}
        />
      )}
      {!isValid && (
        <p
          id={errorId}
          className={[styles['input-info'], styles.error].join(' ')}
        >
          {errorMessage}
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

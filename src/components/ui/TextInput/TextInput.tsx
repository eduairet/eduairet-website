'use client';

import { ChangeEventHandler } from 'react';
import styles from './TextInput.module.scss';
import { TextInputType } from '@/models';
import useTextInput from '@/hooks/useTextInput';

interface IProps {
  id: string;
  label: string;
  type?: TextInputType;
  required?: boolean;
  value?: string;
  // eslint-disable-next-line unused-imports/no-unused-vars, no-unused-vars
  onChange: (value: string, isValid: boolean) => void;
}

export default function TextInput({
  id,
  label,
  onChange,
  value = '',
  required = true,
  type = 'text',
}: IProps) {
  const { isValid, errorMessage, setFirstFocus } = useTextInput(
    type,
    id as string,
    value
  );

  const handleChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    setFirstFocus(true);
    onChange(e.target.value, isValid);
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
          onBlur={() => setFirstFocus(true)}
          onChange={handleChange}
        />
      ) : (
        <input
          className={[styles.input, !isValid ? styles.invalid : ''].join(' ')}
          id={id}
          type={type}
          value={value}
          required={required}
          onBlur={() => setFirstFocus(true)}
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

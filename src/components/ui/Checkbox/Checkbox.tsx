import { ChangeEventHandler } from 'react';
import styles from './Checkbox.module.scss';

interface IProps {
  id: string;
  label: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

export default function Checkbox({
  id,
  label,
  disabled,
  onChange,
  checked = false,
}: IProps) {
  return (
    <div className={styles['checkbox-wrapper']}>
      <input
        type='checkbox'
        id={id}
        checked={checked}
        disabled={disabled}
        className={styles.checkbox}
        onChange={onChange}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}

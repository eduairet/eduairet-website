import { ChangeEventHandler } from 'react';
import styles from './Checkbox.module.scss';

interface IProps {
  id: string;
  label: string;
  checked: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

export default function Checkbox({ id, label, checked, onChange }: IProps) {
  return (
    <div className={styles['checkbox-wrapper']}>
      <input
        type='checkbox'
        id={id}
        className={styles.checkbox}
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}

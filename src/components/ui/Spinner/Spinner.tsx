import styles from './Spinner.module.scss';

interface IProps {
  size?: 'small' | 'medium' | 'large';
}

export default function Spinner({ size = 'small' }: IProps) {
  return <div className={[styles.spinner, styles[size]].join(' ')}></div>;
}

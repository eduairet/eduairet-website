import styles from './IconButton.module.scss';

interface IProps {
  title: string;
}

export default function IconButtonScreenTitle({ title }: IProps) {
  return <span className={styles['screen-only']}>{title}</span>;
}

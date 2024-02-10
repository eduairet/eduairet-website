import { memo } from 'react';
import styles from './IconButton.module.scss';

interface IProps {
  title: string;
}

const IconButtonScreenTitle = ({ title }: IProps) => {
  return <span className={styles['screen-reader-only']}>{title}</span>;
};

export default memo(IconButtonScreenTitle);

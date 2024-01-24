import { ReactNode } from 'react';
import styles from './MainWrapper.module.scss';

interface IProps {
  children: ReactNode;
}

export default function MainWrapper({ children }: IProps) {
  return <main className={styles.main}>{children}</main>;
}

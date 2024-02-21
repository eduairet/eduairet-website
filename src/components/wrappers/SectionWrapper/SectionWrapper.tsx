import { ReactNode } from 'react';
import styles from './SectionWrapper.module.scss';

interface IProps {
  children: ReactNode;
}

export default function SectionWrapper({ children }: IProps) {
  return <section className={styles.section}>{children}</section>;
}

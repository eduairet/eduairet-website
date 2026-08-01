import styles from './HomeSummary.module.scss';

interface IProps {
  summary: string;
}

export default function HomeSummary({ summary }: IProps) {
  return <p className={styles.summary}>{summary}</p>;
}

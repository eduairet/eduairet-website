import styles from './HomeSection.module.scss';
import { TOOLS } from './techStack';

interface IProps {
  tool: string;
}

export default function TechIcon({ tool }: IProps) {
  const { name, Icon } = TOOLS[tool];
  if (!Icon) return null;

  return (
    <span className={styles.techIcon} role='img' aria-label={name} title={name}>
      <svg
        viewBox='0 0 24 24'
        xmlns='http://www.w3.org/2000/svg'
        aria-hidden='true'
        focusable='false'
      >
        <Icon />
      </svg>
    </span>
  );
}

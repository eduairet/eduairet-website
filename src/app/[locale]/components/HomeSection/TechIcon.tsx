import styles from './HomeSection.module.scss';
import type { TechIconData } from './techStack';

interface IProps {
  icon: TechIconData;
}

export default function TechIcon({ icon }: IProps) {
  return (
    <span
      className={styles.techIcon}
      role='img'
      aria-label={icon.title}
      title={icon.title}
    >
      <svg
        viewBox='0 0 24 24'
        xmlns='http://www.w3.org/2000/svg'
        aria-hidden='true'
        focusable='false'
      >
        <path d={icon.path} />
      </svg>
    </span>
  );
}

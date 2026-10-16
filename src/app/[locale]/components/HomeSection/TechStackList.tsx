import styles from './HomeSection.module.scss';
import TechIcon from './TechIcon';

interface IProps {
  icons: string[];
  tools: string[];
  label: string;
  className?: string;
}

export default function TechStackList({
  icons,
  tools,
  label,
  className = '',
}: IProps) {
  if (icons.length + tools.length === 0) return null;
  return (
    <ul className={`${styles.stack} ${className}`.trim()} aria-label={label}>
      {icons.map((tool) => (
        <li key={tool}>
          <TechIcon tool={tool} />
        </li>
      ))}
      {tools.map((tool) => (
        <li key={tool} className={styles.toolPill}>
          {tool}
        </li>
      ))}
    </ul>
  );
}

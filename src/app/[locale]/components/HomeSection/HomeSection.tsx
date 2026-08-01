import styles from './HomeSection.module.scss';
import { Dictionary } from '@/models';
import SectionCard from './SectionCard';
import { resolveStack } from './techStack';

interface IProps {
  id: string;
  section: Dictionary['experience'];
}

export default function HomeSection({ id, section }: IProps) {
  return (
    <section id={id} className={styles.section}>
      <h2 className={styles.title}>{section.title}</h2>
      <ul className={styles.cards}>
        {section.items.map((entry, i) => (
          <SectionCard
            key={`${id}-${i.toString().padStart(2, '0')}`}
            entry={entry}
            icons={resolveStack(entry.stack)}
          />
        ))}
      </ul>
    </section>
  );
}

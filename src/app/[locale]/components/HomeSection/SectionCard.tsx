'use client';

import { motion, useReducedMotion } from 'framer-motion';
import styles from './HomeSection.module.scss';
import { SectionEntry } from '@/models';
import TechIcon from './TechIcon';
import type { TechIconData } from './techStack';

interface IProps {
  entry: SectionEntry;
  icons: TechIconData[];
}

export default function SectionCard({ entry, icons }: IProps) {
  const reduceMotion = useReducedMotion();

  const motionProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: false, amount: 0.3 },
        transition: { ease: 'easeInOut' as const, duration: 0.6 },
      };

  return (
    <motion.li className={styles.card} {...motionProps}>
      <div className={styles.content}>
        <p className={styles.period}>{entry.period}</p>
        <h3 className={styles.roleTitle}>
          {entry.roleUrl ? (
            <a href={entry.roleUrl} target='_blank' rel='noopener noreferrer'>
              {entry.role}
            </a>
          ) : (
            entry.role
          )}
        </h3>
        {(entry.company || entry.meta) && (
          <p className={styles.company}>
            {entry.companyUrl ? (
              <a
                href={entry.companyUrl}
                target='_blank'
                rel='noopener noreferrer'
              >
                {entry.company}
              </a>
            ) : (
              entry.company
            )}
            {entry.meta && (
              <span className={styles.meta}>
                {entry.company ? ' · ' : ''}
                {entry.meta}
              </span>
            )}
          </p>
        )}
        <p className={styles.description}>{entry.description}</p>
      </div>
      {icons.length > 0 && (
        <ul className={styles.stack} aria-label='Tech stack'>
          {icons.map((icon) => (
            <li key={icon.title}>
              <TechIcon icon={icon} />
            </li>
          ))}
        </ul>
      )}
    </motion.li>
  );
}

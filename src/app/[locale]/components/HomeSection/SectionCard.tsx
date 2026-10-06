'use client';

import { useContext } from 'react';
import { motion } from 'framer-motion';
import styles from './HomeSection.module.scss';
import { SectionEntry } from '@/models';
import { LanguageContext } from '@/store/LanguageProvider';
import TechIcon from './TechIcon';
import type { TechIconData } from './techStack';

interface IProps {
  entry: SectionEntry;
  icons: TechIconData[];
}

export default function SectionCard({ entry, icons }: IProps) {
  const { content } = useContext(LanguageContext);

  // Same props on server and client; MotionConfig (template.tsx) drops the
  // slide for users who prefer reduced motion.
  return (
    <motion.li
      className={styles.card}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ ease: 'easeInOut', duration: 0.6 }}
    >
      <div className={styles.content}>
        <p className={styles.period}>{entry.period}</p>
        <h3 className={styles.roleTitle}>
          {entry.roleUrl ? (
            <a href={entry.roleUrl} target='_blank' rel='noopener noreferrer'>
              {entry.role}
              <span className='visually-hidden'> {content.home.newTab}</span>
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
                <span className='visually-hidden'> {content.home.newTab}</span>
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
        <ul className={styles.stack} aria-label={content.home.techStack}>
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

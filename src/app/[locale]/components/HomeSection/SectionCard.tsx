'use client';

import { useContext, useRef } from 'react';
import styles from './HomeSection.module.scss';
import { SectionEntry } from '@/models';
import { LanguageContext } from '@/store/LanguageProvider';
import TechStackList from './TechStackList';
import ExternalLink from '@/components/ui/ExternalLink/ExternalLink';
import { useCardShape } from '@/components/art/CardShapes/useCardShape';
import { REVEAL_CLASS } from '@/components/wrappers/RevealOnScroll/useReveal';
import { fillTemplate, githubHandle } from '@/utils/template.utils';

interface IProps {
  entry: SectionEntry;
  icons: string[];
  tools: string[];
}

export default function SectionCard({ entry, icons, tools }: IProps) {
  const { content } = useContext(LanguageContext);
  const cardRef = useRef<HTMLLIElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useCardShape(cardRef, contentRef, styles.shape);

  return (
    <li ref={cardRef} className={`${styles.card} ${REVEAL_CLASS}`}>
      <div ref={contentRef} className={styles.content}>
        <p className={styles.period}>{entry.period}</p>
        <h3 className={styles.roleTitle}>
          {entry.roleUrl ? (
            <ExternalLink href={entry.roleUrl} newTab={content.home.newTab}>
              {entry.role}
            </ExternalLink>
          ) : (
            entry.role
          )}
        </h3>
        {(entry.company || entry.meta) && (
          <p className={styles.company}>
            {entry.companyUrl ? (
              <ExternalLink
                href={entry.companyUrl}
                newTab={content.home.newTab}
              >
                {entry.company}
              </ExternalLink>
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
        <p className={styles.description}>
          {fillTemplate(entry.description, githubHandle(content.home.newTab))}
        </p>
        <TechStackList
          icons={icons}
          tools={tools}
          label={content.home.techStack}
        />
      </div>
    </li>
  );
}

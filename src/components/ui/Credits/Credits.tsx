import { Fragment } from 'react';
import styles from './Credits.module.scss';
import { getDictionary } from '@/app/[locale]/dictionaries';
import { Lang } from '@/models';
import { CreditLinks } from '@/utils/constants';

interface IProps {
  lang: Lang;
}

export default async function Credits({ lang }: IProps) {
  const content = await getDictionary(lang);

  // Splitting on a captured {key} puts the keys at the odd indexes.
  return (
    <p className={styles.credits}>
      {content.footer.credits.split(/\{(\w+)\}/).map((part, i) => {
        const link = i % 2 ? CreditLinks[part] : undefined;
        return (
          <Fragment key={i}>
            {link ? (
              <a href={link.href} target='_blank' rel='noopener noreferrer'>
                {link.label}
                <span className='visually-hidden'> {content.home.newTab}</span>
              </a>
            ) : (
              part
            )}
          </Fragment>
        );
      })}
    </p>
  );
}

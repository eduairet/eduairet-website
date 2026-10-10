import styles from './Credits.module.scss';
import { getDictionary } from '@/app/[locale]/dictionaries';
import { Lang } from '@/models';
import { CreditLinks } from '@/utils/constants';
import { fillTemplate } from '@/utils/template.utils';
import ExternalLink from '@/components/ui/ExternalLink/ExternalLink';

interface IProps {
  lang: Lang;
}

export default async function Credits({ lang }: IProps) {
  const content = await getDictionary(lang);

  return (
    <p className={styles.credits}>
      {fillTemplate(content.footer.credits, (key) => (
        <ExternalLink href={CreditLinks[key].href} newTab={content.home.newTab}>
          {CreditLinks[key].label}
        </ExternalLink>
      ))}
    </p>
  );
}

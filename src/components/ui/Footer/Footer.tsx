import styles from './Footer.module.scss';
import { getDictionary } from '@/app/[locale]/dictionaries';
import { Lang } from '@/models';
import ThemeButton from '../../svg/ThemeButton';
import GitHubLink from '@/components/svg/GitHubLink';
import XLink from '@/components/svg/XLink';
import LinkedInLink from '@/components/svg/LinkedInLink';

interface IProps {
  lang: Lang;
}

export default async function Footer({ lang }: IProps) {
  const content = await getDictionary(lang);

  return (
    <footer className={styles.footer}>
      <p>Eduardo Aire Torres {new Date().getFullYear()}</p>
      <section
        aria-label={content.footer.social.ariaLabel}
        className={styles.section}
      >
        <div className={styles.actions}>
          <GitHubLink />
          <LinkedInLink />
          <XLink />
        </div>
      </section>
      <section
        aria-label={content.footer.theme.ariaLabel}
        className={styles.section}
      >
        <p>{content.footer.theme.text}</p>
        <ThemeButton />
      </section>
    </footer>
  );
}

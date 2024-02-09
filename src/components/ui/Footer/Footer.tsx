import styles from './Footer.module.scss';
import { getDictionary } from '@/app/[locale]/dictionaries';
import { Lang } from '@/models';
import ThemeButton from '../ThemeButton';
import GitHubLink from '@/components/ui/GitHubLink';
import XLink from '@/components/ui/XLink';
import LinkedInLink from '@/components/ui/LinkedInLink';
import InstagramLink from '../InstagramLink';
import EmailLink from '../EmailLink';

interface IProps {
  lang: Lang;
}

export default async function Footer({ lang }: IProps) {
  const content = await getDictionary(lang);

  return (
    <footer className={styles.footer}>
      <section
        aria-label={content.footer.social.ariaLabel}
        className={styles.section}
      >
        <div className={styles.actions}>
          <GitHubLink />
          <LinkedInLink />
          <XLink />
          <InstagramLink />
          <EmailLink />
        </div>
      </section>
      <section className={styles.section}>
        <p>Eduardo Aire Torres {new Date().getFullYear()}</p>
        <p
          aria-label={content.footer.theme.ariaLabel}
          className={styles.actions}
        >
          <span>{content.footer.theme.text}</span>
          <ThemeButton />
        </p>
      </section>
    </footer>
  );
}

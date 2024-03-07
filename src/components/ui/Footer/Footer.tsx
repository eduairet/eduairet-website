import styles from './Footer.module.scss';
import { getDictionary } from '@/app/[locale]/dictionaries';
import { Lang } from '@/models';
import GitHubLink from '@/components/ui/SocialLinks/GitHubLink';
import LinkedInLink from '@/components/ui/SocialLinks/LinkedInLink';
import XLink from '@/components/ui/SocialLinks/XLink';
import InstagramLink from '@/components/ui/SocialLinks/InstagramLink';
import EmailLink from '@/components/ui/SocialLinks/EmailLink';
import ThemeButton from '@/components/ui/Buttons/ThemeButton/ThemeButton';

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

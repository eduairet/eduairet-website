import styles from './privacy.module.scss';
import { getDictionary } from '@/app/[locale]/dictionaries';
import ExternalLink from '@/components/ui/ExternalLink/ExternalLink';
import PageTransition from '@/components/wrappers/PageTransition/PageTransition';
import type { LocaleProps } from '@/models';
import { PRIVACY_UPDATED, PrivacyLinks } from '@/utils/constants';
import { contactDetail, fillTemplate } from '@/utils/template.utils';
import { buildPageMetadata } from '@/utils/server';

export async function generateMetadata({ params }: LocaleProps) {
  return buildPageMetadata((await params).locale, 'privacy');
}

export default async function Privacy({ params }: LocaleProps) {
  const locale = (await params).locale;
  const content = await getDictionary(locale);
  const { privacy } = content;

  const updated = new Intl.DateTimeFormat(locale, {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(new Date(PRIVACY_UPDATED));

  const fill = (text: string) =>
    fillTemplate(
      text,
      (key) =>
        contactDetail(key) ?? (
          <ExternalLink
            href={PrivacyLinks[key]}
            newTab={content.home.newTab}
            inline
          >
            {privacy.links[key]}
          </ExternalLink>
        )
    );

  return (
    <PageTransition>
      <article className={styles.privacy}>
        <h1>{privacy.title}</h1>
        <p className={styles.updated}>
          {fillTemplate(privacy.updated, () => (
            <time dateTime={PRIVACY_UPDATED}>{updated}</time>
          ))}
        </p>
        <p>{privacy.intro}</p>
        {privacy.sections.map(({ id, title, body }) => (
          <section key={id} id={id}>
            <h2>{title}</h2>
            {body.map((block, i) =>
              typeof block === 'string' ? (
                <p key={i}>{fill(block)}</p>
              ) : (
                <ul key={i}>
                  {block.map((item, j) => (
                    <li key={j}>{fill(item)}</li>
                  ))}
                </ul>
              )
            )}
          </section>
        ))}
      </article>
    </PageTransition>
  );
}

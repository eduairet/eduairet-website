import type { Metadata } from 'next';
import '@/styles/main.scss';
import styles from './global-not-found.module.scss';
import { Dictionary, EnContent, EsContent } from '@/models';
import { PageUrls } from '@/utils/constants';
import TypekitStylesheet from '@/components/metadata/TypekitStylesheet';
import ThemeScript from '@/components/metadata/ThemeScript';

const en = new Dictionary(EnContent);
const es = new Dictionary(EsContent);

export const metadata: Metadata = {
  title: en.meta.notFound.title,
  description: en.meta.notFound.description,
};

// Unmatched URLs carry no locale, so the page speaks both languages.
export default function GlobalNotFound() {
  return (
    <html lang='en'>
      <head>
        <TypekitStylesheet />
      </head>
      <body suppressHydrationWarning>
        <ThemeScript />
        <main id='main' className={styles.page}>
          <h1>{en.notFound.title}</h1>
          <p lang='es'>{es.notFound.title}</p>
          <p>
            <a href={PageUrls.home_('en')}>{en.nav.home}</a>
            {' · '}
            <a href={PageUrls.home_('es')} lang='es'>
              {es.nav.home}
            </a>
          </p>
        </main>
      </body>
    </html>
  );
}

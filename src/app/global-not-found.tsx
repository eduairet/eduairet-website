import type { Metadata } from 'next';
import '@/styles/main.scss';
import styles from './global-not-found.module.scss';
import { Dictionary, EnContent, EsContent } from '@/models';
import {
  PageUrls,
  THEME_INIT_SCRIPT,
  TYPEKIT_LOADER,
  TYPEKIT_URL,
} from '@/utils/constants';

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
        <link rel='preload' as='style' href={TYPEKIT_URL} />
        <script dangerouslySetInnerHTML={{ __html: TYPEKIT_LOADER }} />
      </head>
      <body suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
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

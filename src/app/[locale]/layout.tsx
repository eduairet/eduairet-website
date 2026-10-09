import { ReactNode } from 'react';
import { preconnect } from 'react-dom';
import localFont from 'next/font/local';
import '@/styles/main.scss';
import { Lang, toUiContent } from '@/models';
import { TYPEKIT_LOADER, TYPEKIT_URL } from '@/utils/constants';
import { getDictionary } from '@/app/[locale]/dictionaries';
import StoreProvider from '@/store/StoreProvider';
import MainWrapper from '@/components/wrappers/MainWrapper/MainWrapper';
import BodyWrapper from '@/components/wrappers/BodyWrapper';
import NavBar from '@/components/ui/Nav/NavBar/NavBar';
import Footer from '@/components/ui/Footer/Footer';

const eatIconsVF = localFont({
  src: '/fonts/EatIconsVF.woff2',
  preload: true,
  variable: '--eat-icons-vf',
  display: 'swap',
});

interface IProps {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

// Only en and es; any other first segment is an unmatched URL.
export const dynamicParams = false;

export {
  generateLocaleParams as generateStaticParams,
  siteMetadata as metadata,
  viewport,
} from '@/utils/server';

export default async function RootLayout({ children, params }: IProps) {
  const locale = (await params).locale;
  const content = await getDictionary(locale);

  // Font files need a CORS connection; the CSS @import does not.
  preconnect('https://use.typekit.net', { crossOrigin: 'anonymous' });
  preconnect('https://p.typekit.net');

  return (
    <html
      lang={locale}
      className={eatIconsVF.variable}
      data-scroll-behavior='smooth'
    >
      <head>
        <link rel='preload' as='style' href={TYPEKIT_URL} />
        <script dangerouslySetInnerHTML={{ __html: TYPEKIT_LOADER }} />
        <noscript>
          <link rel='stylesheet' href={TYPEKIT_URL} />
        </noscript>
      </head>
      <StoreProvider locale={locale as Lang} content={toUiContent(content)}>
        <BodyWrapper>
          <a className='skip-link' href='#main'>
            {content.nav.skip}
          </a>
          <header>
            <NavBar locale={locale as Lang} />
          </header>
          <MainWrapper>{children}</MainWrapper>
          <Footer lang={locale as Lang} />
        </BodyWrapper>
      </StoreProvider>
    </html>
  );
}

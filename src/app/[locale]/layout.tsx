import { ReactNode } from 'react';
import { preconnect } from 'react-dom';
import localFont from 'next/font/local';
import '@/styles/main.scss';
import { Lang, toUiContent } from '@/models';
import { getDictionary } from '@/app/[locale]/dictionaries';
import StoreProvider from '@/store/StoreProvider';
import MainWrapper from '@/components/wrappers/MainWrapper/MainWrapper';
import BodyWrapper from '@/components/wrappers/BodyWrapper';
import NavBar from '@/components/ui/Nav/NavBar/NavBar';
import Footer from '@/components/ui/Footer/Footer';

const typekit = process.env.NEXT_PUBLIC_TYPEKIT;
// Added by a script, so the font CSS never blocks the first paint; the
// Degular fallback keeps the text in place until it arrives.
const loadTypekit = `(function(){var l=document.createElement('link');l.rel='stylesheet';l.href=${JSON.stringify(
  typekit ?? ''
).replace(/</g, '\u003c')};document.head.appendChild(l)})()`;

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
        <link rel='preload' as='style' href={typekit} />
        <script dangerouslySetInnerHTML={{ __html: loadTypekit }} />
        <noscript>
          <link rel='stylesheet' href={typekit} />
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

import { ReactNode } from 'react';
import { preconnect } from 'react-dom';
import localFont from 'next/font/local';
import '@/styles/main.scss';
import { Lang, toUiContent } from '@/models';
import TypekitStylesheet from '@/components/metadata/TypekitStylesheet';
import { getDictionary } from '@/app/[locale]/dictionaries';
import StoreProvider from '@/store/StoreProvider';
import MainWrapper from '@/components/wrappers/MainWrapper/MainWrapper';
import BodyWrapper from '@/components/wrappers/BodyWrapper';
import NavBar from '@/components/ui/Nav/NavBar/NavBar';
import Footer from '@/components/ui/Footer/Footer';
import Credits from '@/components/ui/Credits/Credits';

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
        <TypekitStylesheet />
      </head>
      <StoreProvider locale={locale as Lang} content={toUiContent(content)}>
        <BodyWrapper>
          <a className='skip-link' href='#main'>
            {content.nav.skip}
          </a>
          <header>
            <NavBar locale={locale as Lang} />
          </header>
          <MainWrapper>
            {children}
            <Credits lang={locale as Lang} />
          </MainWrapper>
          <Footer lang={locale as Lang} />
        </BodyWrapper>
      </StoreProvider>
    </html>
  );
}

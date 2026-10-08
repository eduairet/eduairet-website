import { ReactNode } from 'react';
import { preconnect } from 'react-dom';
import localFont from 'next/font/local';
import '@/styles/main.scss';
import { Lang } from '@/models';
import { getDictionary } from '@/app/[locale]/dictionaries';
import { locales } from '@/utils/server';
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

export { siteMetadata as metadata, viewport } from '@/utils/server';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({ children, params }: IProps) {
  const locale = (await params).locale;
  const content = await getDictionary(locale);

  // Typekit fonts load in CORS mode; its CSS @imports p.typekit.net without it.
  preconnect('https://use.typekit.net', { crossOrigin: 'anonymous' });
  preconnect('https://p.typekit.net');

  return (
    <html
      lang={locale}
      className={eatIconsVF.variable}
      data-scroll-behavior='smooth'
    >
      <head>
        <link rel='stylesheet' href={process.env.NEXT_PUBLIC_TYPEKIT} />
      </head>
      <StoreProvider>
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

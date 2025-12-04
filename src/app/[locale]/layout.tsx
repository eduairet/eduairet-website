import { ReactNode } from 'react';
import localFont from 'next/font/local';
import Script from 'next/script';
import '@/styles/main.scss';
import { Lang } from '@/models';
import StoreProvider from '@/store/StoreProvider';
import MetaIcons from '@/components/metadata/MetaIcons';
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

export { generateMetadata, viewport } from '@/utils/server';

export default async function RootLayout({ children, params }: IProps) {
  const locale = (await params).locale;

  return (
    <html lang={locale} className={eatIconsVF.variable}>
      <head>
        <link rel='stylesheet' href={process.env.NEXT_PUBLIC_TYPEKIT} />
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
          async
          defer
        />
        <MetaIcons />
      </head>
      <StoreProvider>
        <BodyWrapper>
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

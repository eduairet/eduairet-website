import { ReactNode } from 'react';
import type { Metadata } from 'next';
import '@/styles/globals.scss';
import '@/styles/pages.scss';
import StoreProvider from '@/store/StoreProvider';
import NavBar from '@/components/ui/NavBar/NavBar';
import EatLogoBg from '@/components/brand/EatLogoBg';
import MainWrapper from '@/components/layout/MainWrapper/MainWrapper';
import Footer from '@/components/ui/Footer/Footer';
import { Lang } from '@/models';

export const metadata: Metadata = {
  title: "eat's portfolio",
  description:
    'Eduardo Aire Torres professional portfolio, development and design',
};

interface IProps {
  children: ReactNode;
  params: {
    locale: Lang;
  };
}

export default function RootLayout({ children, params: { locale } }: IProps) {
  return (
    <html lang={locale}>
      <head>
        <link
          rel='preload'
          href={process.env.NEXT_PUBLIC_TYPEKIT}
          as='style'
          crossOrigin='anonymous'
        />
        <link rel='stylesheet' href={process.env.NEXT_PUBLIC_TYPEKIT} />
      </head>
      <StoreProvider>
        <body>
          <NavBar lang={locale} />
          <MainWrapper>
            <EatLogoBg />
            {children}
          </MainWrapper>
          <Footer lang={locale} />
        </body>
      </StoreProvider>
    </html>
  );
}

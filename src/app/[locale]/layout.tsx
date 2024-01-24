import { ReactNode } from 'react';
import type { Metadata } from 'next';
import '@/styles/globals.scss';
import NavBar from '@/components/ui/NavBar/NavBar.1';
import EatLogoBg from '@/components/brand/EatLogoBg';
import StoreProvider from '@/store/StoreProvider';
import Footer from '@/components/ui/Footer/Footer';
import MainWrapper from '@/components/layout/MainWrapper/MainWrapper';
import { Lang } from '@/models';

export const metadata: Metadata = {
  title: "eat's portfolio",
  description:
    'Eduardo Aire Torres professional portfolio, development and design',
};

interface IProps {
  children: ReactNode;
  params: {
    locale: string;
  };
}

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

export default function RootLayout({ children, params: { locale } }: IProps) {
  return (
    <StoreProvider>
      <html lang={locale}>
        <head>
          <link rel='stylesheet' href={process.env.NEXT_PUBLIC_TYPEKIT}></link>
        </head>
        <body>
          <NavBar lang={locale as Lang} />
          <MainWrapper>
            <EatLogoBg />
            {children}
          </MainWrapper>
          <Footer />
        </body>
      </html>
    </StoreProvider>
  );
}

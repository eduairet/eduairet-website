import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import '@/styles/globals.scss';
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
  const pathname = headers().get('x-pathname') as string;

  return (
    <StoreProvider>
      <html lang={locale}>
        <head>
          <link rel='stylesheet' href={process.env.NEXT_PUBLIC_TYPEKIT}></link>
        </head>
        <body>
          <NavBar lang={locale} pathname={pathname} />
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

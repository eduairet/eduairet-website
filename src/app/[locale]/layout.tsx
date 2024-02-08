import { ReactNode } from 'react';
import '@/styles/main.scss';
import { Lang } from '@/models';
import StoreProvider from '@/store/StoreProvider';
import NavBar from '@/components/ui/NavBar/NavBar';
import EatLogoBg from '@/components/brand/EatLogoBg';
import MainWrapper from '@/components/wrappers/MainWrapper/MainWrapper';
import Footer from '@/components/ui/Footer/Footer';

interface IProps {
  children: ReactNode;
  params: {
    locale: Lang;
  };
}

export { generateMetadata } from '@/utils';

export default function RootLayout({ children, params: { locale } }: IProps) {
  return (
    <html lang={locale}>
      <head>
        <link rel='preload' href={process.env.NEXT_PUBLIC_TYPEKIT} as='style' />
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

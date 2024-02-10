import { ReactNode } from 'react';
import '@/styles/main.scss';
import { Lang } from '@/models';
import StoreProvider from '@/store/StoreProvider';
import MetaIcons from '@/components/metadata/MetaIcons';
import MainWrapper from '@/components/wrappers/MainWrapper/MainWrapper';
import BodyWrapper from '@/components/wrappers/BodyWrapper';
import NavBar from '@/components/ui/NavBar/NavBar';
import Footer from '@/components/ui/Footer/Footer';
import EatLogoBg from '@/components/brand/EatLogoBg';

interface IProps {
  children: ReactNode;
  params: {
    locale: Lang;
  };
}

export { generateMetadata, viewport } from '@/utils';

export default function RootLayout({ children, params: { locale } }: IProps) {
  return (
    <html lang={locale}>
      <head>
        <link rel='stylesheet' href={process.env.NEXT_PUBLIC_TYPEKIT} />
        <MetaIcons />
      </head>
      <StoreProvider>
        <BodyWrapper>
          <NavBar />
          <MainWrapper>
            <EatLogoBg />
            {children}
          </MainWrapper>
          <Footer lang={locale} />
        </BodyWrapper>
      </StoreProvider>
    </html>
  );
}

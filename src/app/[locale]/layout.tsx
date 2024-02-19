import { ReactNode } from 'react';
import localFont from 'next/font/local';
import '@/styles/main.scss';
import { Lang } from '@/models';
import StoreProvider from '@/store/StoreProvider';
import MetaIcons from '@/components/metadata/MetaIcons';
import MainWrapper from '@/components/wrappers/MainWrapper/MainWrapper';
import BodyWrapper from '@/components/wrappers/BodyWrapper';
import NavBar from '@/components/ui/NavBar/NavBar';
import Footer from '@/components/ui/Footer/Footer';
import EatLogoBg from '@/components/brand/EatLogoBg';

const eatIconsVF = localFont({
  src: './fonts/EatIconsVF.woff2',
  preload: true,
  variable: '--eat-icons-vf',
  display: 'swap',
});

interface IProps {
  children: ReactNode;
  params: {
    locale: Lang;
  };
}

export { generateMetadata, viewport } from '@/utils/server';

export default function RootLayout({ children, params: { locale } }: IProps) {
  return (
    <html lang={locale} className={eatIconsVF.variable}>
      <head>
        <link rel='stylesheet' href={process.env.NEXT_PUBLIC_TYPEKIT} />
        <MetaIcons />
      </head>
      <StoreProvider>
        <BodyWrapper>
          <header>
            <NavBar />
          </header>
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

import type { Metadata } from 'next';
import '@/styles/globals.scss';
import NavBar from '@/components/ui/NavBar/NavBar';
import StoreProvider from '@/store/StoreProvider';

export const metadata: Metadata = {
  title: "eat's portfolio",
  description:
    'Eduardo Aire Torres professional portfolio, development and design',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      <html lang='en'>
        <head>
          <link rel='stylesheet' href={process.env.NEXT_PUBLIC_TYPEKIT}></link>
        </head>
        <body>
          <NavBar />
          {children}
        </body>
      </html>
    </StoreProvider>
  );
}

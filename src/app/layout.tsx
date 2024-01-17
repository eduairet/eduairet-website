import type { Metadata } from 'next';
import '@/styles/globals.scss';

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
    <html lang='en'>
      <head>
        <link rel='stylesheet' href={process.env.NEXT_PUBLIC_TYPEKIT}></link>
      </head>
      <body>{children}</body>
    </html>
  );
}

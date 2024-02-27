'use client';

import { ReactNode, useContext } from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { LanguageContext } from '@/store/LanguageProvider';

interface IProps {
  children: ReactNode;
}

export default function GoogleCaptchaWrapper({ children }: IProps) {
  const { locale } = useContext(LanguageContext);

  const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={recaptchaKey ?? 'NOT DEFINED'}
      language={locale}
      scriptProps={{
        async: false,
        defer: false,
        appendTo: 'body',
        nonce: undefined,
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
}

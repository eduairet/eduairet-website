'use client';

import { useState, useCallback, useEffect } from 'react';

export default function useRecaptcha() {
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [isRecaptchaLoading, setIsRecaptchaLoading] = useState(false);

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  const isReady = () => {
    return (
      typeof window !== 'undefined' &&
      typeof window.grecaptcha !== 'undefined' &&
      typeof window.grecaptcha.execute !== 'undefined'
    );
  };

  const verifyRecaptcha = useCallback(async () => {
    setIsRecaptchaLoading(true);
    const token = await window.grecaptcha.execute(siteKey as string, {
      action: 'submit',
    });
    setRecaptchaToken(token);
    setIsRecaptchaLoading(false);
  }, [siteKey]);

  useEffect(() => {
    if (!isReady()) return;
    verifyRecaptcha();
  }, [verifyRecaptcha]);

  return {
    isRecaptchaLoading,
    recaptchaToken,
  };
}

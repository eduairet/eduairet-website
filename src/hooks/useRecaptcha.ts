'use client';

import { useEffect, useState } from 'react';

export default function useRecaptcha() {
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [isRecaptchaLoading, setIsRecaptchaLoading] = useState(false);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      typeof window.grecaptcha === 'undefined' ||
      typeof window.grecaptcha.execute !== 'function' ||
      !siteKey
    ) {
      return;
    }

    let cancelled = false;
    const timeoutId = window.setTimeout(() => {
      if (cancelled) return;
      setIsRecaptchaLoading(true);
      void window.grecaptcha
        .execute(siteKey, { action: 'submit' })
        .then((token) => {
          if (cancelled) return;
          setRecaptchaToken(token);
          setIsRecaptchaLoading(false);
        });
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [siteKey]);

  return {
    isRecaptchaLoading,
    recaptchaToken,
  };
}

'use client';

import { useState, useEffect, useCallback } from 'react';

export default function useRecaptcha() {
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [isRecaptchaLoading, setIsRecaptchaLoading] = useState(false);

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  const loadRecaptchaScript = useCallback(() => {
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, [siteKey]);

  const verifyRecaptcha = useCallback(async () => {
    setIsRecaptchaLoading(true);
    const token = await (window as any).grecaptcha.execute(siteKey, {
      action: 'submit',
    });
    setRecaptchaToken(token);
    setIsRecaptchaLoading(false);
  }, [siteKey]);

  const resetRecaptcha = () => {
    setIsRecaptchaLoading(true);
    (window as any).grecaptcha.reset(siteKey);
    setRecaptchaToken(null);
    setIsRecaptchaLoading(false);
  };

  useEffect(() => {
    if ((window as any).grecaptcha) return;
    setIsRecaptchaLoading(true);
    loadRecaptchaScript();
    setIsRecaptchaLoading(false);
  }, [loadRecaptchaScript]);

  return {
    isRecaptchaLoading,
    recaptchaToken,
    verifyRecaptcha,
    resetRecaptcha,
  };
}

'use client';

import { useState, useCallback } from 'react';

export default function useRecaptcha() {
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [isRecaptchaLoading, setIsRecaptchaLoading] = useState(false);

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  const resetRecaptcha = useCallback(async () => {
    setIsRecaptchaLoading(true);
    await (window as any).grecaptcha.reset(siteKey);
    setRecaptchaToken(null);
    setIsRecaptchaLoading(false);
  }, [siteKey]);

  const verifyRecaptcha = useCallback(async () => {
    setIsRecaptchaLoading(true);
    const token = await (window as any).grecaptcha.execute(siteKey, {
      action: 'submit',
    });
    setRecaptchaToken(token);
    setIsRecaptchaLoading(false);
  }, [siteKey]);

  return {
    isRecaptchaLoading,
    recaptchaToken,
    verifyRecaptcha,
    resetRecaptcha,
  };
}

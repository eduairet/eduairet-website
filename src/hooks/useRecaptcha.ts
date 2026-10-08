'use client';

import { useCallback } from 'react';
import { recaptchaAction } from '@/utils/constants';

// reCAPTCHA v3 tokens expire after two minutes and can be verified only once,
// so a fresh token is requested when the user submits, not on page load.
export default function useRecaptcha() {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  const getRecaptchaToken = useCallback(async (): Promise<string | null> => {
    if (
      typeof window === 'undefined' ||
      typeof window.grecaptcha === 'undefined' ||
      typeof window.grecaptcha.execute !== 'function' ||
      !siteKey
    ) {
      return null;
    }

    try {
      await new Promise<void>((resolve) => window.grecaptcha.ready(resolve));
      return await window.grecaptcha.execute(siteKey, {
        action: recaptchaAction,
      });
    } catch {
      return null;
    }
  }, [siteKey]);

  return { getRecaptchaToken };
}

'use client';

import { useCallback } from 'react';
import { recaptchaAction } from '@/utils/constants';

const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
let loading: Promise<void> | null = null;

// Loaded on first use of the form, so page loads stay free of the script,
// its cookies and its console messages.
export function loadRecaptcha() {
  loading ??= new Promise<void>((resolve, reject) => {
    if (!siteKey) return reject(new Error('Missing reCAPTCHA site key'));
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.onload = () => window.grecaptcha.ready(resolve);
    script.onerror = () => {
      // Let the next attempt try again.
      loading = null;
      script.remove();
      reject(new Error('reCAPTCHA failed to load'));
    };
    document.head.appendChild(script);
  });
  return loading;
}

// reCAPTCHA v3 tokens expire after two minutes and can be verified only once,
// so a fresh token is requested when the user submits, not on page load.
export default function useRecaptcha() {
  const getRecaptchaToken = useCallback(async (): Promise<string | null> => {
    try {
      await loadRecaptcha();
      if (!siteKey || typeof window.grecaptcha?.execute !== 'function')
        return null;
      return await window.grecaptcha.execute(siteKey, {
        action: recaptchaAction,
      });
    } catch {
      return null;
    }
  }, []);

  return { getRecaptchaToken, loadRecaptcha };
}

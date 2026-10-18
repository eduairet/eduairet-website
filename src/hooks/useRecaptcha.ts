'use client';

import { recaptchaAction } from '@/utils/constants';

const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
let loading: Promise<void> | null = null;

// Load on first use, so the page skips the script, its cookies and its console noise.
export function loadRecaptcha() {
  loading ??= new Promise<void>((resolve, reject) => {
    if (!siteKey) return reject(new Error('Missing reCAPTCHA site key'));
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.onload = () => window.grecaptcha.ready(resolve);
    script.onerror = () => {
      loading = null;
      script.remove();
      reject(new Error('reCAPTCHA failed to load'));
    };
    document.head.appendChild(script);
  });
  return loading;
}

// A token expires in two minutes and verifies once, so request it at submit.
export async function getRecaptchaToken(): Promise<string | null> {
  try {
    await loadRecaptcha();
    return await window.grecaptcha.execute(siteKey as string, {
      action: recaptchaAction,
    });
  } catch {
    return null;
  }
}

export default function useRecaptcha() {
  return { getRecaptchaToken, loadRecaptcha };
}

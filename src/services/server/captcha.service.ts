import { GoogleCaptchaResponse } from '@/models';
import { recaptchaAction } from '@/utils/constants';

// reCAPTCHA v3 doesn't fail bots; it gives them a low score.
const MIN_CAPTCHA_SCORE = 0.5;
// Without billing, Google only returns 0.1, 0.3, 0.7 or 0.9.
const MIN_CONFIRMATION_SCORE = 0.9;

export async function verifyCaptcha(token: string, hostname: string) {
  // In the body, not the URL, so the secret stays out of request logs.
  const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    body: new URLSearchParams({
      secret: process.env.RECAPTCHA_SECRET_KEY ?? '',
      response: token,
    }),
  });
  const captcha: GoogleCaptchaResponse = await res.json();
  const score = captcha.score ?? 0;
  const passed =
    captcha.success &&
    captcha.action === recaptchaAction &&
    captcha.hostname === hostname &&
    score >= MIN_CAPTCHA_SCORE;
  // Only a trusted visitor gets a confirmation, so bots can't mail strangers.
  return { passed, trusted: passed && score >= MIN_CONFIRMATION_SCORE };
}

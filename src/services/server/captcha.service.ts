import { GoogleCaptchaResponse } from '@/models';
import { recaptchaAction } from '@/utils/constants';

// reCAPTCHA v3 doesn't fail bots; it gives them a low score.
const MIN_CAPTCHA_SCORE = 0.5;

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
  return (
    captcha.success &&
    captcha.action === recaptchaAction &&
    captcha.hostname === hostname &&
    (captcha.score ?? 0) >= MIN_CAPTCHA_SCORE
  );
}

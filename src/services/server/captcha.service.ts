import { GoogleCaptchaResponse } from '@/models';
import { recaptchaAction } from '@/utils/constants';

// reCAPTCHA v3 doesn't fail bots; it gives them a low score.
const MIN_CAPTCHA_SCORE = 0.5;

export async function verifyCaptcha(
  token: string
): Promise<GoogleCaptchaResponse> {
  // In the body, not the URL, so the secret stays out of request logs.
  const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    body: new URLSearchParams({
      secret: process.env.RECAPTCHA_SECRET_KEY ?? '',
      response: token,
    }),
  });
  const data = await res.json();
  return {
    success: data.success,
    score: data.score,
    action: data.action,
    challengeTs: new Date(data.challenge_ts),
    hostname: data.hostname,
    errorCodes: data['error-codes'],
  };
}

export function isTrustedCaptcha(
  captcha: GoogleCaptchaResponse,
  hostname: string
) {
  return (
    captcha.success &&
    captcha.action === recaptchaAction &&
    captcha.hostname === hostname &&
    (captcha.score ?? 0) >= MIN_CAPTCHA_SCORE
  );
}

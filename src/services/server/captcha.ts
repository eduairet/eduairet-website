'use server';

import { GoogleCaptchaResponse } from '@/models';

export async function verifyCaptcha(
  token: string | null
): Promise<GoogleCaptchaResponse> {
  const res = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    {
      method: 'POST',
    }
  );
  const data = await res.json();
  return {
    success: data.success,
    challengeTs: new Date(data.challenge_ts),
    hostname: data.hostname,
    errorCodes: data['error-codes'],
  };
}

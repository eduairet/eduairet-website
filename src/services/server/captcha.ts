'use server';

import { fetchData } from '@/utils/server';
import { GoogleCaptchaResponse } from '@/models';

export async function verifyCaptcha(token: string | null) {
  const res = await fetchData<GoogleCaptchaResponse>(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    {
      method: 'POST',
    }
  );
  return res;
}

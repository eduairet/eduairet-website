import { verifyCaptcha } from '@/services/server';
import { sendEmail } from '@/services/server/email.service';

export async function POST(req: Request) {
  if (req.method !== 'POST')
    return Response.json({ status: 405, body: 'Method Not Allowed' });

  const { locale, name, email, message, captchaToken } = await req.json();

  if (!locale || !name || !email || !message || !captchaToken)
    return Response.json({ status: 400, body: 'Bad Request' });

  try {
    const captchaVerification = await verifyCaptcha(captchaToken);
    if (!captchaVerification.success)
      return Response.json({
        status: 400,
        body: 'Captcha verification failed. Please try again',
      });

    const mailResponse = await sendEmail(locale, email, name, message);
    if (!mailResponse.success)
      return Response.json({
        status: mailResponse.status,
        body: mailResponse.message,
      });
  } catch (e) {
    return Response.json({ status: 500, body: 'Internal Server Error' });
  }

  return Response.json({ result: 'Success' });
}

import { verifyCaptcha } from '@/services/server';

export async function POST(req: Request) {
  if (req.method !== 'POST')
    return Response.json({ status: 405, body: 'Method Not Allowed' });

  const { name, email, message, captchaToken } = await req.json();

  if (!name || !email || !message || !captchaToken)
    return Response.json({ status: 400, body: 'Bad Request' });

  try {
    const captchaVerification = await verifyCaptcha(captchaToken);
    if (!captchaVerification.success)
      return Response.json({ status: 400, body: 'Bad Request' });
  } catch (e) {
    return Response.json({ status: 500, body: 'Internal Server Error' });
  }

  return Response.json({ result: 'Success' });
}

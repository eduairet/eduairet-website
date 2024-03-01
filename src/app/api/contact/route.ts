import { verifyCaptcha } from '@/services/server';
import { sendEmail } from '@/services/server';
import { serverFormValidations } from '@/utils/server';

export async function POST(req: Request) {
  if (req.method !== 'POST')
    return new Response('Method Not Allowed', { status: 405 });

  const { locale, name, email, message, recaptchaToken } = await req.json();

  if (
    !locale ||
    !recaptchaToken ||
    !serverFormValidations.contactForm(name, email, message)
  )
    return new Response('Bad Request', { status: 400 });

  try {
    const captchaVerification = await verifyCaptcha(recaptchaToken);
    if (!captchaVerification.success)
      return new Response("We couldn't verify your ReCaptcha Token", {
        status: 400,
      });

    const mailResponse = await sendEmail(locale, email, name, message);
    if (!mailResponse.success)
      return new Response(mailResponse.message, { status: 400 });
  } catch (e) {
    return new Response('Internal Server Error', { status: 500 });
  }

  return Response.json('Email sent successfully!');
}

import { sendEmail, verifyCaptcha } from '@/services/server';
import { serverFormValidations } from '@/utils/server';

export async function POST(req: Request) {
  if (req.method !== 'POST')
    return new Response('Method Not Allowed', { status: 405 });

  const body = await req.json().catch(() => null);
  if (!body) return new Response('Bad Request', { status: 400 });
  const { locale, name, email, message, recaptchaToken } = body;
  const fields = [locale, name, email, message, recaptchaToken];

  if (
    fields.some((field) => typeof field !== 'string' || !field) ||
    !serverFormValidations.contactForm(name, email, message)
  )
    return new Response('Bad Request', { status: 400 });

  try {
    const captcha = await verifyCaptcha(
      recaptchaToken,
      new URL(req.url).hostname
    );
    if (!captcha.passed)
      return new Response("We couldn't verify your ReCaptcha Token", {
        status: 400,
      });

    const mailResponse = await sendEmail(
      locale,
      email,
      name,
      message,
      captcha.trusted
    );
    if (!mailResponse.success)
      return new Response(mailResponse.message, {
        status: mailResponse.status,
      });
  } catch {
    return new Response('Internal Server Error', { status: 500 });
  }

  return Response.json('Email sent successfully!');
}

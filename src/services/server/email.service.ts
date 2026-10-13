import { Lang, MailResponse } from '@/models';
import { SITE_URL } from '@/utils/constants';
import {
  defaultLocale,
  isLang,
  signAwsRequest,
  type AwsCredentials,
} from '@/utils/server';

type SesConfig = { region: string; from: string; credentials: AwsCredentials };

type SesEmail = {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
};

const SES_TIMEOUT_MS = 10_000;

const copy = {
  en: {
    subjectPrefix: 'Message from',
    sent: 'Email sent successfully',
    failed: 'There was an error sending the email',
    confirmation: {
      subject: 'Thanks for your message',
      text: `Hi there,\n\nThanks for writing to me. Your message reached me, and I'll write back soon.\n\nEduardo\n${SITE_URL}`,
    },
  },
  es: {
    subjectPrefix: 'Mensaje de',
    sent: 'Correo enviado correctamente',
    failed: 'Hubo un error al enviar el correo',
    confirmation: {
      subject: 'Gracias por tu mensaje',
      text: `¡Hola!\n\nGracias por escribirme. Tu mensaje ya me llegó y te responderé pronto.\n\nEduardo\n${SITE_URL}`,
    },
  },
};

// Names may hold line breaks, and a subject must stay on one line.
const oneLine = (text: string) => text.replace(/\s+/g, ' ').trim();

// SES error messages can include addresses, so only the type is logged.
const sesErrorType = async (res: Response) => {
  const body = await res.json().catch(() => ({}));
  const type: string =
    res.headers.get('x-amzn-errortype') ?? body.__type ?? body.code ?? '';
  return type.split(':')[0].split('#').pop();
};

const sesConfig = (): SesConfig | null => {
  const region = process.env.SES_REGION;
  const accessKeyId = process.env.SES_ACCESS_KEY_ID;
  const secretAccessKey = process.env.SES_SECRET_ACCESS_KEY;
  const from = process.env.CONTACT_EMAIL;
  if (!region || !accessKeyId || !secretAccessKey || !from) return null;
  return { region, from, credentials: { accessKeyId, secretAccessKey } };
};

const sendSesEmail = async (
  { region, from, credentials }: SesConfig,
  { to, subject, text, replyTo }: SesEmail
) => {
  const url = `https://email.${region}.amazonaws.com/v2/email/outbound-emails`;
  const body = JSON.stringify({
    FromEmailAddress: `Eduardo Aire Torres <${from}>`,
    Destination: { ToAddresses: [to] },
    ReplyToAddresses: replyTo ? [replyTo] : undefined,
    Content: {
      Simple: {
        Subject: { Data: oneLine(subject), Charset: 'UTF-8' },
        Body: { Text: { Data: text, Charset: 'UTF-8' } },
      },
    },
  });

  try {
    const res = await fetch(url, {
      method: 'POST',
      body,
      // Without a limit, a stuck call holds the function until Vercel stops it.
      signal: AbortSignal.timeout(SES_TIMEOUT_MS),
      headers: signAwsRequest({
        method: 'POST',
        url,
        headers: { 'content-type': 'application/json' },
        body,
        region,
        service: 'ses',
        credentials,
      }),
    });
    if (res.ok) return true;
    console.error(
      `SES SendEmail failed: ${res.status} ${await sesErrorType(res)}`
    );
  } catch (error) {
    console.error(`SES SendEmail failed: ${(error as Error).name}`);
  }
  return false;
};

export const sendEmail = async (
  locale: Lang,
  email: string,
  name: string,
  message: string
): Promise<MailResponse> => {
  const t = copy[isLang(locale) ? locale : defaultLocale];
  const failed = { success: false, message: t.failed, status: 500 };

  const config = sesConfig();
  if (!config) {
    console.error('SES SendEmail failed: missing SES environment variables');
    return failed;
  }

  const sentToMe = await sendSesEmail(config, {
    to: config.from,
    replyTo: email,
    subject: `${t.subjectPrefix} ${name} (${email})`,
    text: message,
  });
  if (!sentToMe) return failed;

  // The message already reached me, so a failed confirmation is not an error.
  await sendSesEmail(config, { to: email, ...t.confirmation });

  return { success: true, message: t.sent, status: 200 };
};

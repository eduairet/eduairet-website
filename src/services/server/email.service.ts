import { randomUUID } from 'node:crypto';
import { after } from 'next/server';
import { AwsCredentials, Lang, MailResponse } from '@/models';
import { SITE_URL } from '@/utils/constants';
import {
  assumeRoleWithWebIdentity,
  awsErrorType,
  defaultLocale,
  isLang,
  postSignedAws,
  putDynamoDbItem,
} from '@/utils/server';

type AwsSession = { region: string; from: string; credentials: AwsCredentials };

type SesEmail = {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
};

type ContactMessage = {
  locale: Lang;
  name: string;
  email: string;
  message: string;
};

type SendEmailOptions = {
  sendConfirmation?: boolean;
  oidcToken: string | null;
};

const SES_ROLE_SESSION = 'eduairet-website-contact';
const MESSAGE_RETENTION_SECONDS = 90 * 24 * 60 * 60;

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

const awsSession = async (
  oidcToken: string | null
): Promise<AwsSession | null> => {
  const region = process.env.SES_REGION;
  const roleArn = process.env.SES_ROLE_ARN;
  const from = process.env.CONTACT_EMAIL;
  if (!region || !roleArn || !from) {
    console.error('SES SendEmail failed: missing SES environment variables');
    return null;
  }
  if (!oidcToken) {
    console.error('SES SendEmail failed: no Vercel OIDC token');
    return null;
  }
  try {
    const credentials = await assumeRoleWithWebIdentity({
      region,
      roleArn,
      sessionName: SES_ROLE_SESSION,
      webIdentityToken: oidcToken,
    });
    return { region, from, credentials };
  } catch (error) {
    console.error(
      `STS AssumeRoleWithWebIdentity failed: ${(error as Error).message}`
    );
    return null;
  }
};

const sendSesEmail = async (
  { region, from, credentials }: AwsSession,
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
    const res = await postSignedAws({
      url,
      headers: { 'content-type': 'application/json' },
      body,
      region,
      service: 'ses',
      credentials,
    });
    if (res.ok) return true;
    console.error(
      `SES SendEmail failed: ${res.status} ${await awsErrorType(res)}`
    );
  } catch (error) {
    console.error(`SES SendEmail failed: ${(error as Error).name}`);
  }
  return false;
};

const saveMessage = async (
  { region, credentials }: AwsSession,
  { locale, name, email, message }: ContactMessage
) => {
  const tableName = process.env.CONTACT_TABLE;
  if (!tableName) {
    console.error('DynamoDB PutItem failed: missing CONTACT_TABLE');
    return;
  }
  const now = new Date();
  try {
    await putDynamoDbItem({
      region,
      tableName,
      credentials,
      item: {
        id: { S: randomUUID() },
        createdAt: { S: now.toISOString() },
        expiresAt: {
          N: String(
            Math.floor(now.getTime() / 1000) + MESSAGE_RETENTION_SECONDS
          ),
        },
        vercelEnv: { S: process.env.VERCEL_ENV ?? 'development' },
        locale: { S: locale },
        name: { S: name },
        email: { S: email },
        message: { S: message },
      },
    });
  } catch (error) {
    console.error(`DynamoDB PutItem failed: ${(error as Error).message}`);
  }
};

export const sendEmail = async (
  locale: Lang,
  email: string,
  name: string,
  message: string,
  { sendConfirmation = false, oidcToken }: SendEmailOptions
): Promise<MailResponse> => {
  const lang = isLang(locale) ? locale : defaultLocale;
  const t = copy[lang];
  const failed = { success: false, message: t.failed, status: 500 };

  const session = await awsSession(oidcToken);
  if (!session) return failed;

  // The backup runs after the response, so it can't delay or change it.
  after(() => saveMessage(session, { locale: lang, name, email, message }));

  const sentToMe = await sendSesEmail(session, {
    to: session.from,
    replyTo: email,
    subject: `${t.subjectPrefix} ${name} (${email})`,
    text: message,
  });
  if (!sentToMe) return failed;

  // The message already reached me, so a failed confirmation is not an error.
  if (sendConfirmation)
    await sendSesEmail(session, { to: email, ...t.confirmation });

  return { success: true, message: t.sent, status: 200 };
};

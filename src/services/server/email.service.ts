'use server';

import { Lang, MailResponse } from '@/models';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

export const sendEmail = async (
  locale: Lang,
  email: string,
  name: string,
  message: string
) => {
  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const successMessage =
    locale === 'es'
      ? 'Correo enviado correctamente'
      : 'Email sent successfully';
  const errorMessage =
    locale === 'es'
      ? 'Hubo un error al enviar el correo'
      : 'There was an error sending the email';

  const subjectHost = locale === 'es' ? 'Mensaje de' : 'Message from';
  const messageClient =
    locale === 'es'
      ? 'Pronto me comunicaré contigo, mientras tanto te dejo una copia de tu mensaje:'
      : 'I will contact you soon, in the meantime I leave you a copy of your message:';

  const mailOptionsHost: Mail.Options = {
    from: process.env.GMAIL,
    to: process.env.GMAIL,
    subject: `${subjectHost} ${name} (${email})`,
    text: message,
  };

  const mailOptionsClient: Mail.Options = {
    from: process.env.GMAIL,
    to: email,
    subject: `${
      locale === 'es' ? 'Mensaje recibido' : 'Message received'
    } - eduairet.com`,
    text: `${messageClient}\n\n${message}`,
  };

  const sendMailToHostPromise = () =>
    new Promise<MailResponse>((resolve, reject) => {
      transport.sendMail(mailOptionsHost, function (err) {
        if (!err) {
          resolve({
            success: true,
            message: successMessage,
            status: 200,
          });
        } else {
          reject({
            success: false,
            message: errorMessage,
            status: 500,
          });
        }
      });
    });

  const sendMailToClientPromise = () =>
    new Promise<MailResponse>((resolve, reject) => {
      transport.sendMail(mailOptionsClient, function (err) {
        if (!err) {
          resolve({
            success: true,
            message: successMessage,
            status: 200,
          });
        } else {
          reject({
            success: false,
            message: errorMessage,
            status: 500,
          });
        }
      });
    });

  const sendMails = async () => {
    const res = await Promise.all([
      sendMailToHostPromise(),
      sendMailToClientPromise(),
    ]);

    const success = res.every((r) => r.success);

    return {
      success,
      message: success ? successMessage : errorMessage,
      status: success ? 200 : 500,
    };
  };

  return await sendMails();
};

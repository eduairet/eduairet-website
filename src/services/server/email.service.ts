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

  const subject = locale === 'es' ? 'Mensaje de' : 'Message from';

  const mailOptions: Mail.Options = {
    from: process.env.GMAIL,
    to: process.env.GMAIL,
    cc: email,
    subject: `${subject} ${name} (${email})`,
    text: message,
  };

  const sendMailPromise = () =>
    new Promise<MailResponse>((resolve, reject) => {
      transport.sendMail(mailOptions, function (err) {
        if (!err) {
          resolve({
            success: true,
            message: 'Email sent successfully',
            status: 200,
          });
        } else {
          reject({
            success: false,
            message: 'There was an error sending the email',
            status: 500,
          });
        }
      });
    });

  return await sendMailPromise();
};

export type GoogleCaptchaResponse = {
  success: boolean;
  challengeTs: Date;
  hostname: string;
  errorCodes: number[];
};

export type MailResponse = {
  success: boolean;
  message: string;
  status: number;
};

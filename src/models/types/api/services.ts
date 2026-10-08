export type GoogleCaptchaResponse = {
  success: boolean;
  score?: number;
  action?: string;
  challengeTs: Date;
  hostname: string;
  errorCodes?: string[];
};

export type MailResponse = {
  success: boolean;
  message: string;
  status: number;
};

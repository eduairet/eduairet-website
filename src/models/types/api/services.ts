export type GoogleCaptchaResponse = {
  success: boolean;
  score?: number;
  action?: string;
  hostname?: string;
};

export type MailResponse = {
  success: boolean;
  message: string;
  status: number;
};

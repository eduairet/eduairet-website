export type GoogleCaptchaResponse = {
  success: boolean;
  challenge_ts: Date;
  hostname: string;
  errorCodes: number[];
};

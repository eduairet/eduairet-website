export type GoogleCaptchaResponse = {
  success: boolean;
  challengeTs: Date;
  hostname: string;
  errorCodes: number[];
};

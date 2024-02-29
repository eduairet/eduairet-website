import { Lang } from '../types';

export class ApiResponse<T> {
  message?: string | undefined;
  success: boolean;
  data?: T;

  constructor(message: string, success: boolean, data?: T) {
    this.message = message;
    this.success = success;
    this.data = data;
  }
}

export class ContactRequest {
  locale: Lang;
  name: string;
  email: string;
  message: string;
  recaptchaToken: string;

  constructor(
    locale: Lang,
    name: string,
    email: string,
    message: string,
    recaptchaToken: string
  ) {
    this.locale = locale;
    this.name = name;
    this.email = email;
    this.message = message;
    this.recaptchaToken = recaptchaToken;
  }
}

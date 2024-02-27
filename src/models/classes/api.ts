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
  name: string;
  email: string;
  message: string;
  captchaToken: string;

  constructor(
    name: string,
    email: string,
    message: string,
    captchaToken: string
  ) {
    this.name = name;
    this.email = email;
    this.message = message;
    this.captchaToken = captchaToken;
  }
}

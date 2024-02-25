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

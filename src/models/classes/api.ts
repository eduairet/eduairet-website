import { ContactFormField } from '../enums';

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

interface IField {
  value: string;
  isValid: boolean;
}

export class ContactFormModel {
  [ContactFormField.NAME]: IField;
  [ContactFormField.EMAIL]: IField;
  [ContactFormField.MESSAGE]: IField;

  constructor(name?: IField, email?: IField, message?: IField) {
    this[ContactFormField.NAME] = name || { value: '', isValid: false };
    this[ContactFormField.EMAIL] = email || { value: '', isValid: false };
    this[ContactFormField.MESSAGE] = message || { value: '', isValid: false };
  }
}

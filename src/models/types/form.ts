/* eslint-disable no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */

interface IValidation {
  errorMessage: string;
  validate: (value: string) => boolean;
}

export type TextInputType =
  | 'text'
  | 'email'
  | 'textarea'
  | 'password'
  | 'number'
  | 'tel'
  | 'url';

export type TextInputValidations = {
  [key in TextInputType]: IValidation;
};

export type ContactFormErrors = {
  [key in 'name' | 'email' | 'message' as string]: string;
};

'use-client';

import { TextInputValidations } from '@/models';

// TODO Localized error messages

export const textInputValidations: TextInputValidations = {
  text: {
    errorMessage: 'Invalid input',
    validate: (value: string) =>
      value.length > 0 && value.length < 100 && /^[a-zA-Z\s]*$/.test(value),
  },
  textarea: {
    errorMessage: 'Invalid input',
    validate: (value: string) =>
      value.length > 0 && value.length < 1000 && /^[a-zA-Z\s]*$/.test(value),
  },
  email: {
    errorMessage: 'Invalid email',
    validate: (value: string) =>
      value.length > 0 &&
      value.length < 100 &&
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value),
  },
  password: {
    errorMessage:
      'Password must contain at least 8 characters, including uppercase, lowercase letters and numbers',
    validate: (value: string) =>
      value.length > 0 &&
      value.length < 100 &&
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(value),
  },
  number: {
    errorMessage: 'Invalid input',
    validate: (value: string) =>
      +value.length > 0 && +value.length < 100 && /^[0-9]*$/.test(value),
  },
  tel: {
    errorMessage: 'Invalid phone number',
    validate: (value: string) => /^[0-9]{10}$/.test(value),
  },
  url: {
    errorMessage: 'Invalid URL, just https://... allowed',
    validate: (value: string) => /^(https):\/\/[^ "]+$/.test(value),
  },
};

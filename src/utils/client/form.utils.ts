'use-client';

import { TextInputValidations } from '@/models';

// TODO Localized error messages

export const textInputValidations: TextInputValidations = {
  text: {
    validate: (value: string) =>
      value.length > 0 && value.length < 100 && /^[a-zA-Z\s]*$/.test(value),
  },
  textarea: {
    validate: (value: string) =>
      value.length > 0 && value.length < 1000 && /^[a-zA-Z\s]*$/.test(value),
  },
  email: {
    validate: (value: string) =>
      value.length > 0 &&
      value.length < 100 &&
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value),
  },
  password: {
    validate: (value: string) =>
      value.length > 0 &&
      value.length < 100 &&
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(value),
  },
  number: {
    validate: (value: string) =>
      +value.length > 0 && +value.length < 100 && /^[0-9]*$/.test(value),
  },
  tel: {
    validate: (value: string) => /^[0-9]{10}$/.test(value),
  },
  url: {
    validate: (value: string) => /^(https):\/\/[^ "]+$/.test(value),
  },
};

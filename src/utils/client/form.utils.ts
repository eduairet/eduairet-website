'use-client';

import { formRegex, fieldLength } from '@/utils/constants';
import { TextInputValidations } from '@/models';

export const textInputValidations: TextInputValidations = {
  text: {
    min: fieldLength.text.min,
    max: fieldLength.text.max,
    validate: (value: string) =>
      value.length >= fieldLength.text.min &&
      value.length <= fieldLength.text.max &&
      formRegex.text.test(value),
  },
  textarea: {
    min: fieldLength.textarea.min,
    max: fieldLength.textarea.max,
    validate: (value: string) =>
      value.length >= fieldLength.textarea.min &&
      value.length <= fieldLength.textarea.max &&
      formRegex.textarea.test(value),
  },
  email: {
    validate: (value: string) => formRegex.email.test(value),
  },
  password: {
    min: fieldLength.password.min,
    max: fieldLength.password.max,
    validate: (value: string) =>
      value.length >= fieldLength.password.min &&
      value.length <= fieldLength.password.max &&
      formRegex.password.test(value),
  },
  number: {
    validate: (value: string) => formRegex.number.test(value),
  },
  tel: {
    min: fieldLength.tel.min,
    max: fieldLength.tel.max,
    validate: (value: string) => formRegex.tel.test(value),
  },
  url: {
    validate: (value: string) => formRegex.url.test(value),
  },
};

import { formRegex, fieldLength } from '@/utils/constants';

export const serverFormValidations = {
  contactForm: (name: string, email: string, message: string) => {
    const nameIsValid =
      name.length >= fieldLength.text.min &&
      name.length <= fieldLength.text.max &&
      formRegex.text.test(name);

    const emailIsValid = formRegex.email.test(email);

    const messageIsValid =
      message.length >= fieldLength.textarea.min &&
      message.length <= fieldLength.textarea.max &&
      formRegex.textarea.test(message);

    return nameIsValid && emailIsValid && messageIsValid;
  },
};

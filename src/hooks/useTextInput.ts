import { useContext, useState } from 'react';
import { textInputValidations } from '@/utils/client';
import { LanguageContext } from '@/store/LanguageProvider';
import { TextInputType } from '@/models';

export default function useTextInput(
  type: TextInputType,
  inputName: string,
  value: string,
  focused: boolean
) {
  const { content } = useContext(LanguageContext);
  const emptyError = content.contact.form.errors.empty[inputName];
  const invalidError = content.contact.form.errors.invalid[inputName];
  const [validation, setValidation] = useState<{
    isValid: boolean;
    errorMessage: string | null;
  }>({ isValid: true, errorMessage: null });

  if (!focused) return validation;

  let isValid = true;
  let errorMessage = validation.errorMessage;
  if (!value) {
    isValid = false;
    errorMessage = emptyError;
  } else if (!textInputValidations[type].validate(value)) {
    isValid = false;
    errorMessage = invalidError;
  }

  if (
    isValid !== validation.isValid ||
    errorMessage !== validation.errorMessage
  ) {
    setValidation({ isValid, errorMessage });
  }

  return { isValid, errorMessage };
}

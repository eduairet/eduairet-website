import { useContext } from 'react';
import { textInputValidations } from '@/utils/client';
import { LanguageContext } from '@/store/LanguageProvider';
import { TextInputType } from '@/models';

export type TextInputError = 'empty' | 'invalid' | null;

export function getTextInputError(
  type: TextInputType,
  value: string
): TextInputError {
  if (!value) return 'empty';
  if (!textInputValidations[type].validate(value)) return 'invalid';
  return null;
}

// Errors only show once the field has been touched (left or submitted).
export default function useTextInput(
  type: TextInputType,
  inputName: string,
  value: string,
  touched: boolean
) {
  const { content } = useContext(LanguageContext);
  const error = touched ? getTextInputError(type, value) : null;

  return {
    isValid: !error,
    errorMessage: error ? content.contact.form.errors[error][inputName] : null,
  };
}

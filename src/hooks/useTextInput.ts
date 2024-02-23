import { useState, useContext, useEffect } from 'react';
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
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (focused) {
      if (!value) {
        setIsValid(false);
        setErrorMessage(emptyError);
        return;
      }
      const validate = textInputValidations[type].validate(value);
      if (!validate) {
        setIsValid(false);
        setErrorMessage(invalidError);
        return;
      }
      setIsValid(true);
    }
  }, [emptyError, invalidError, type, value, focused]);

  return {
    isValid,
    errorMessage,
  };
}

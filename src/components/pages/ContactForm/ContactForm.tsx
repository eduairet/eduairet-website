'use client';

import { useState, useContext, useReducer, memo, FormEvent } from 'react';
import { LanguageContext } from '@/store/LanguageProvider';
import { ContactFormModel, ContactFormField } from '@/models';
import FormWrapper from '@/components/wrappers/FormWrapper/FormWrapper';
import TextInput from '@/components/ui/TextInput/TextInput';
import Button from '@/components/ui/Button/Button';

interface IReducerAction {
  type: ContactFormField;
  value: string;
  isValid: boolean;
}

interface IReducer {
  // eslint-disable-next-line unused-imports/no-unused-vars, no-unused-vars
  (state: ContactFormModel, action: IReducerAction): ContactFormModel;
}

const ContactFormReducer: IReducer = (state, action) => ({
  ...state,
  [action.type]: {
    value: action.value,
    isValid: action.isValid,
  },
});

function ContactForm() {
  const { content } = useContext(LanguageContext);
  const [formError, setFormError] = useState<string | null>(null);
  const [state, dispatch] = useReducer(
    ContactFormReducer,
    new ContactFormModel()
  );

  const formIsValid = () => {
    return state.name.isValid && state.email.isValid && state.message.isValid;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO Implement form submission
    if (!formIsValid()) return setFormError('Form is invalid');
    setFormError('Form is valid but is not sending data');
  };

  return (
    <FormWrapper onSubmit={handleSubmit} error={formError}>
      <TextInput
        id={ContactFormField.NAME}
        label={content.contact.form.name}
        value={state.name.value}
        onChange={(value: string, isValid: boolean) =>
          dispatch({
            type: ContactFormField.NAME,
            value,
            isValid,
          })
        }
      />
      <TextInput
        id={ContactFormField.EMAIL}
        label={content.contact.form.email}
        type='email'
        value={state.email.value}
        onChange={(value: string, isValid: boolean) =>
          dispatch({
            type: ContactFormField.EMAIL,
            value,
            isValid,
          })
        }
      />
      <TextInput
        id={ContactFormField.MESSAGE}
        label={content.contact.form.message}
        value={state.message.value}
        type='textarea'
        onChange={(value: string, isValid: boolean) =>
          dispatch({
            type: ContactFormField.MESSAGE,
            value,
            isValid,
          })
        }
      />
      <Button type='submit'>{content.contact.form.submit}</Button>
    </FormWrapper>
  );
}

export default memo(ContactForm);

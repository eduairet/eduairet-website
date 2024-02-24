'use client';

import { useState, useContext, useReducer, memo, FormEvent } from 'react';
import { LanguageContext } from '@/store/LanguageProvider';
import {
  ContactFormModel,
  ContactFormField,
  SpinnerSize,
  TextInputType,
} from '@/models';
import { fetchData } from '@/utils/client';
import FormWrapper from '@/components/wrappers/FormWrapper/FormWrapper';
import TextInput from '@/components/ui/TextInput/TextInput';
import Button from '@/components/ui/Button/Button';
import Spinner from '@/components/ui/Spinner/Spinner';

interface IReducerAction {
  type: ContactFormField | 'RESET';
  value?: string;
  focused?: boolean;
  isValid?: boolean;
}

interface IReducer {
  // eslint-disable-next-line unused-imports/no-unused-vars, no-unused-vars
  (state: ContactFormModel, action: IReducerAction): ContactFormModel;
}

const ContactFormReducer: IReducer = (state, action) => {
  if (action.type in state) {
    return {
      ...state,
      [action.type]: {
        value: action.value,
        focused: action.focused,
        isValid: action.isValid,
      },
    };
  }
  if (action.type === 'RESET') {
    return new ContactFormModel();
  }
  return state;
};

function ContactForm() {
  const { content } = useContext(LanguageContext);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [formError, setFormError] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [state, dispatch] = useReducer(
    ContactFormReducer,
    new ContactFormModel()
  );

  const formIsValid = () => {
    return state.name.isValid && state.email.isValid && state.message.isValid;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true);
    setFormError(false);
    setSubmitMessage('');
    if (!formIsValid()) {
      setFormError(true);
      setSubmitMessage(content.contact.form.errors.submit);
      setIsSending(false);
      return;
    }
    const res = await fetchData<string>('/api/contact', {
      method: 'POST',
      body: JSON.stringify(state),
    });
    if (!res.success) {
      setFormError(true);
      setSubmitMessage(content.contact.form.errors.submit);
      setIsSending(false);
      return;
    }
    setSubmitMessage(content.contact.form.success);
    dispatch({ type: 'RESET' });
    setIsSending(false);
  };

  const inputFields = [
    {
      id: ContactFormField.NAME,
      label: content.contact.form.name,
      value: state.name.value,
      focused: state.name.focused,
      type: 'text',
    },
    {
      id: ContactFormField.EMAIL,
      label: content.contact.form.email,
      value: state.email.value,
      focused: state.email.focused,
      type: 'email',
    },
    {
      id: ContactFormField.MESSAGE,
      label: content.contact.form.message,
      value: state.message.value,
      focused: state.message.focused,
      type: 'textarea',
    },
  ];

  return (
    <FormWrapper
      onSubmit={handleSubmit}
      error={formError}
      submitMessage={submitMessage}
    >
      {inputFields.map((field) => (
        <TextInput
          key={field.id}
          id={field.id}
          label={field.label}
          type={field.type as TextInputType}
          value={field.value}
          focused={field.focused}
          onChange={(value: string, focused: boolean, isValid: boolean) =>
            dispatch({
              type: field.id,
              value,
              focused,
              isValid,
            })
          }
        />
      ))}
      <Button type='submit' disabled={isSending}>
        {isSending ? (
          <Spinner size={SpinnerSize.XS} />
        ) : (
          content.contact.form.submit
        )}
      </Button>
    </FormWrapper>
  );
}

export default memo(ContactForm);

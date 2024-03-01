'use client';

import { useState, useContext, useReducer, memo, FormEvent } from 'react';
import styles from './ContactForm.module.scss';
import { LanguageContext } from '@/store/LanguageProvider';
import {
  ContactFormModel,
  ContactFormField,
  SpinnerSize,
  TextInputType,
  ContactRequest,
} from '@/models';
import { fetchData } from '@/utils/client';
import { ApiUrls } from '@/utils/constants';
import useRecaptcha from '@/hooks/useRecaptcha';
import FormWrapper from '@/components/wrappers/FormWrapper/FormWrapper';
import TextInput from '@/components/ui/TextInput/TextInput';
import Button from '@/components/ui/Button/Button';
import Spinner from '@/components/ui/Spinner/Spinner';
import Checkbox from '@/components/ui/Checkbox/Checkbox';

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
        ...state[action.type as ContactFormField],
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
  const { locale, content } = useContext(LanguageContext);
  const {
    isRecaptchaLoading,
    recaptchaToken,
    verifyRecaptcha,
    resetRecaptcha,
  } = useRecaptcha();
  const [isSending, setIsSending] = useState(false);
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

    if (!formIsValid() || !recaptchaToken) {
      setFormError(true);
      setSubmitMessage(content.contact.form.errors.submit);
      setIsSending(false);
      return;
    }

    const res = await fetchData<string>(ApiUrls.contact, {
      method: 'POST',
      body: new ContactRequest(
        locale,
        state.name.value,
        state.email.value,
        state.message.value,
        recaptchaToken
      ),
    });

    if (!res.success) {
      setFormError(true);
      setSubmitMessage(content.contact.form.errors.submit);
      setIsSending(false);
      return;
    }

    setSubmitMessage(content.contact.form.success);
    setTimeout(() => {
      setSubmitMessage('');
    }, 10000);

    resetRecaptcha();
    dispatch({ type: 'RESET' });
    setIsSending(false);
  };

  const inputFields = [
    {
      id: ContactFormField.NAME,
      minLength: state.name.minLength,
      maxLength: state.name.maxLength,
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
      minLength: state.message.minLength,
      maxLength: state.message.maxLength,
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
          minLength={field.minLength}
          maxLength={field.maxLength}
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
      <Checkbox
        id='captcha'
        label={content.captcha}
        disabled={isRecaptchaLoading}
        checked={!!recaptchaToken}
        onChange={(e) => {
          e.target.checked ? verifyRecaptcha() : resetRecaptcha();
        }}
      />
      <Button
        type='submit'
        className={styles.submit}
        disabled={isSending || !recaptchaToken || !formIsValid()}
      >
        {isSending || isRecaptchaLoading ? (
          <Spinner size={SpinnerSize.XS} />
        ) : (
          content.contact.form.submit
        )}
      </Button>
    </FormWrapper>
  );
}

export default memo(ContactForm);

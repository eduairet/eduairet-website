'use client';

import {
  useState,
  useContext,
  useReducer,
  useRef,
  memo,
  FormEvent,
} from 'react';
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
import { ApiUrls, PageUrls } from '@/utils/constants';
import useRecaptcha from '@/hooks/useRecaptcha';
import useToast from '@/hooks/useToast';
import { getTextInputError } from '@/hooks/useTextInput';
import FormWrapper from '@/components/wrappers/FormWrapper/FormWrapper';
import TextInput from '@/components/ui/TextInput/TextInput';
import ButtonWrapper from '@/components/wrappers/ButtonWrapper/ButtonWrapper';
import Spinner from '@/components/ui/Spinner/Spinner';
import IntentLink from '@/components/ui/IntentLink/IntentLink';
import Checkbox from '@/components/ui/Checkbox/Checkbox';
import { fillTemplate } from '@/utils/template.utils';

interface IReducerAction {
  type: ContactFormField | 'RESET';
  value?: string;
  focused?: boolean;
  isValid?: boolean;
}

interface IReducer {
  // eslint-disable-next-line no-unused-vars
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

const fieldTypes: Record<ContactFormField, TextInputType> = {
  [ContactFormField.NAME]: 'text',
  [ContactFormField.EMAIL]: 'email',
  [ContactFormField.MESSAGE]: 'textarea',
};

const PRIVACY_CHECK_ID = 'privacy-read';

function ContactForm() {
  const { locale, content } = useContext(LanguageContext);
  const { getRecaptchaToken, loadRecaptcha } = useRecaptcha();
  const { showToast, closeToast } = useToast();
  const [isSending, setIsSending] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const successToast = useRef(0);
  const [privacyRead, setPrivacyRead] = useState(false);
  const [privacyMissing, setPrivacyMissing] = useState(false);
  const [state, dispatch] = useReducer(
    ContactFormReducer,
    new ContactFormModel()
  );

  const lengthHint = (min?: number, max?: number) =>
    typeof min === 'number' && typeof max === 'number'
      ? content.contact.form.lengthHint
          .replace('{min}', String(min))
          .replace('{max}', String(max))
      : undefined;

  // Starts loading on the first focus; a failed load is retried at submit.
  const recaptchaRequested = useRef(false);
  const preloadRecaptcha = () => {
    if (recaptchaRequested.current) return;
    recaptchaRequested.current = true;
    loadRecaptcha().catch(() => {});
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSending) return;
    setSubmitError('');

    // Show every field's error and move focus to the first one to fix.
    const fields = Object.values(ContactFormField);
    const invalid = fields.filter(
      (field) =>
        getTextInputError(fieldTypes[field], state[field].value) !== null
    );
    fields.forEach((field) =>
      dispatch({
        type: field,
        value: state[field].value,
        focused: true,
        isValid: !invalid.includes(field),
      })
    );
    setPrivacyMissing(!privacyRead);
    const toFix = [...invalid, ...(privacyRead ? [] : [PRIVACY_CHECK_ID])];
    if (toFix.length) {
      document.getElementById(toFix[0])?.focus();
      return;
    }

    setIsSending(true);
    const recaptchaToken = await getRecaptchaToken();
    if (!recaptchaToken) {
      setSubmitError(content.contact.form.errors.submit);
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
      setSubmitError(content.contact.form.errors.submit);
      setIsSending(false);
      return;
    }

    // The toast stays until the visitor closes it or types again.
    successToast.current = showToast(content.contact.form.success);
    dispatch({ type: 'RESET' });
    setPrivacyRead(false);
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
      autoComplete: 'name',
    },
    {
      id: ContactFormField.EMAIL,
      label: content.contact.form.email,
      value: state.email.value,
      focused: state.email.focused,
      autoComplete: 'email',
    },
    {
      id: ContactFormField.MESSAGE,
      minLength: state.message.minLength,
      maxLength: state.message.maxLength,
      label: content.contact.form.message,
      value: state.message.value,
      focused: state.message.focused,
    },
  ];

  const { notice, noticeLink, privacyCheck, recaptcha, errors } =
    content.contact.form;

  return (
    <FormWrapper
      onSubmit={handleSubmit}
      onFocus={preloadRecaptcha}
      errorMessage={submitError}
    >
      <p className={styles.instructions}>{content.contact.form.instructions}</p>
      {inputFields.map((field) => (
        <TextInput
          key={field.id}
          id={field.id}
          label={field.label}
          type={fieldTypes[field.id]}
          value={field.value}
          minLength={field.minLength}
          maxLength={field.maxLength}
          hint={lengthHint(field.minLength, field.maxLength)}
          autoComplete={field.autoComplete}
          focused={field.focused}
          onChange={(value: string, focused: boolean, isValid: boolean) => {
            // Fields also report on blur; only a new value clears feedback.
            if (value !== field.value) {
              setSubmitError('');
              closeToast(successToast.current);
            }
            dispatch({
              type: field.id,
              value,
              focused,
              isValid,
            });
          }}
        />
      ))}
      <p className={styles.notice}>{notice}</p>
      <Checkbox
        id={PRIVACY_CHECK_ID}
        required
        checked={privacyRead}
        error={privacyMissing ? errors.privacy : undefined}
        onChange={(e) => {
          setPrivacyRead(e.target.checked);
          setPrivacyMissing(false);
          setSubmitError('');
          closeToast(successToast.current);
        }}
        label={fillTemplate(privacyCheck, () => (
          <IntentLink href={PageUrls.privacy_(locale)}>{noticeLink}</IntentLink>
        ))}
      />
      <ButtonWrapper
        type='submit'
        className={styles.submit}
        ariaDisabled={isSending}
      >
        {isSending ? (
          <Spinner size={SpinnerSize.XS} label={content.contact.form.sending} />
        ) : (
          content.contact.form.submit
        )}
      </ButtonWrapper>
      <p className={styles.recaptcha}>{recaptcha}</p>
    </FormWrapper>
  );
}

export default memo(ContactForm);

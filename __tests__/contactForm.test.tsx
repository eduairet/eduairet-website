import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { LanguageProvider } from '@/store/LanguageProvider';
import { ToastProvider } from '@/store/ToastProvider';
import Toast from '@/components/ui/Toast/Toast';
import { Dictionary, EnContent, EsContent, type Lang } from '@/models';

import { stubResizeObserver } from './helpers/resizeObserver';
import ContactForm from '@/app/[locale]/contact/components/ContactForm/ContactForm';

const en = new Dictionary(EnContent);

const mocks = vi.hoisted(() => ({
  getRecaptchaToken: vi.fn(),
  loadRecaptcha: vi.fn(),
  fetchData: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/en/contact',
  useRouter: () => ({ prefetch: () => {} }),
}));

vi.mock('@/hooks/useRecaptcha', () => ({
  default: () => ({
    getRecaptchaToken: mocks.getRecaptchaToken,
    loadRecaptcha: mocks.loadRecaptcha,
  }),
}));

vi.mock('@/utils/client', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/utils/client')>()),
  fetchData: mocks.fetchData,
}));

const renderForm = (locale: Lang = 'en', content = en) =>
  render(
    <LanguageProvider locale={locale} content={content}>
      <ToastProvider>
        <Toast />
        <ContactForm />
      </ToastProvider>
    </LanguageProvider>
  );

const SUCCESS = en.contact.form.success;

// The toast's status region comes first, then the form's.
const toastStatus = () => screen.getAllByRole('status')[0];
const formStatus = () => screen.getAllByRole('status')[1];

const describedText = (el: HTMLElement) =>
  (el.getAttribute('aria-describedby') ?? '')
    .split(' ')
    .map((id) => document.getElementById(id)?.textContent)
    .join(' | ');

const fillValid = () => {
  fireEvent.change(screen.getByRole('textbox', { name: 'Name' }), {
    target: { value: "Ada O'Brien-Lovelace" },
  });
  fireEvent.change(screen.getByRole('textbox', { name: 'Email' }), {
    target: { value: 'ada+site@example.studio' },
  });
  fireEvent.change(screen.getByRole('textbox', { name: 'Message' }), {
    target: { value: 'Hello there,\nthis message has a line break.' },
  });
  fireEvent.click(privacyBox());
};

const privacyBox = (name = "I've read the privacy notice") =>
  screen.getByRole('checkbox', { name }) as HTMLInputElement;

beforeEach(() => {
  stubResizeObserver();
  mocks.getRecaptchaToken.mockResolvedValue('fresh-token');
  mocks.fetchData.mockResolvedValue({ success: true });
  mocks.loadRecaptcha.mockResolvedValue(undefined);
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('ContactForm reCAPTCHA', () => {
  test('loads reCAPTCHA on the first focus, not on render', () => {
    renderForm();
    expect(mocks.loadRecaptcha).not.toHaveBeenCalled();

    fireEvent.focus(screen.getByRole('textbox', { name: 'Name' }));

    expect(mocks.loadRecaptcha).toHaveBeenCalled();
  });
});

describe('ContactForm privacy notice', () => {
  test.each([
    [
      'en',
      EnContent,
      /backup copy of your message for 90 days/,
      "I've read the privacy notice",
      'privacy notice',
      'This site is protected by reCAPTCHA.',
    ],
    [
      'es',
      EsContent,
      /copia de respaldo de tu mensaje durante 90 días/,
      'He leído el aviso de privacidad',
      'aviso de privacidad',
      'Este sitio está protegido por reCAPTCHA.',
    ],
  ] as const)(
    '%s shows one short line and an unticked box linking the privacy page',
    (locale, data, retention, boxName, linkName, recaptcha) => {
      renderForm(locale, new Dictionary(data));

      expect(screen.getByText(retention).tagName).toBe('P');

      const box = privacyBox(boxName);
      expect(box.checked).toBe(false);
      expect(box.required).toBe(true);
      const page = screen.getByRole('link', { name: linkName });
      expect(page.getAttribute('href')).toBe(`/${locale}/privacy`);
      expect(page.getAttribute('target')).toBeNull();
      expect(box.labels?.[0].contains(page)).toBe(true);

      // reCAPTCHA is named, with no links to Google's policies.
      expect(screen.getByText(recaptcha).tagName).toBe('P');
      expect(screen.getAllByRole('link')).toHaveLength(1);
      expect(document.body.textContent).not.toMatch(/[{}]/);
    }
  );

  test('an unticked box blocks the send, explains why and takes focus', () => {
    renderForm();
    fillValid();
    fireEvent.click(privacyBox());
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    const box = privacyBox();
    expect(document.activeElement).toBe(box);
    expect(box.getAttribute('aria-invalid')).toBe('true');
    expect(describedText(box)).toBe(
      "Please confirm you've read the privacy notice"
    );
    expect(mocks.getRecaptchaToken).not.toHaveBeenCalled();
    expect(mocks.fetchData).not.toHaveBeenCalled();

    fireEvent.click(box);
    expect(box.getAttribute('aria-invalid')).toBeNull();
    expect(box.getAttribute('aria-describedby')).toBeNull();
  });

  test('with empty fields too, every error shows and focus goes to the first field', () => {
    renderForm();
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(document.activeElement).toBe(
      screen.getByRole('textbox', { name: 'Name' })
    );
    expect(privacyBox().getAttribute('aria-invalid')).toBe('true');
    expect(mocks.fetchData).not.toHaveBeenCalled();
  });
});

describe('ContactForm accessibility', () => {
  test.each([
    ['en', EnContent, 'Please fill in all the fields.'],
    ['es', EsContent, 'Llena todos los campos, por favor.'],
  ] as const)(
    '%s asks for every field once, before the fields',
    (locale, data, instructions) => {
      renderForm(locale, new Dictionary(data));
      const fields = screen.getAllByRole('textbox');
      const instruction = screen.getByText(instructions);

      expect(fields).toHaveLength(3);
      expect(
        instruction.compareDocumentPosition(fields[0]) &
          Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();
      fields.forEach((field) =>
        expect(field.hasAttribute('required')).toBe(true)
      );
      expect(document.querySelector('form')?.textContent).not.toContain('*');
    }
  );

  test('fields are named by their labels and linked to their hints', () => {
    renderForm();
    const name = screen.getByRole('textbox', { name: 'Name' });

    expect(name.getAttribute('autocomplete')).toBe('name');
    expect(
      screen
        .getByRole('textbox', { name: 'Email' })
        .getAttribute('autocomplete')
    ).toBe('email');
    expect(describedText(name)).toBe('3 to 100 characters');
    expect(screen.getByText('Please fill in all the fields.')).toBeTruthy();
  });

  test('submitting empty shows linked errors and focuses the first field', () => {
    renderForm();
    const submit = screen.getByRole('button', { name: 'Submit' });
    expect(submit.hasAttribute('disabled')).toBe(false);

    fireEvent.click(submit);

    const name = screen.getByRole('textbox', { name: 'Name' });
    expect(document.activeElement).toBe(name);
    expect(name.getAttribute('aria-invalid')).toBe('true');
    expect(describedText(name)).toContain('Please enter your name');
    expect(
      screen
        .getByRole('textbox', { name: 'Message' })
        .getAttribute('aria-invalid')
    ).toBe('true');
    expect(mocks.getRecaptchaToken).not.toHaveBeenCalled();
  });

  test('error messages say how to fix the input', () => {
    renderForm();
    const email = screen.getByRole('textbox', { name: 'Email' });
    fireEvent.change(email, { target: { value: 'not-an-email' } });
    fireEvent.blur(email);

    expect(describedText(email)).toContain(
      'Please enter an email like name@example.com'
    );
  });

  test('valid input with apostrophes, + and line breaks is sent with a fresh token', async () => {
    // eslint-disable-next-line no-unused-vars
    let resolveFetch: (value: { success: boolean }) => void = () => {};
    mocks.fetchData.mockReturnValue(
      new Promise((resolve) => (resolveFetch = resolve))
    );
    renderForm();
    fillValid();

    const submit = screen.getByRole('button', { name: 'Submit' });
    submit.focus();
    fireEvent.click(submit);

    await waitFor(() => expect(mocks.fetchData).toHaveBeenCalled());
    expect(mocks.getRecaptchaToken).toHaveBeenCalledTimes(1);
    expect(mocks.fetchData.mock.calls[0][1].body).toMatchObject({
      recaptchaToken: 'fresh-token',
      privacyRead: true,
    });

    // While sending the button keeps focus and is named.
    const sending = screen.getByRole('button', { name: 'Sending…' });
    expect(sending.getAttribute('aria-disabled')).toBe('true');
    expect(sending.hasAttribute('disabled')).toBe(false);
    expect(document.activeElement).toBe(sending);

    await act(async () => resolveFetch({ success: true }));
    expect(toastStatus().textContent).toBe(SUCCESS);
  });

  test('a successful send shows the toast, clears the fields and keeps focus', async () => {
    renderForm();
    fillValid();
    const submit = screen.getByRole('button', { name: 'Submit' });
    submit.focus();
    fireEvent.click(submit);

    await waitFor(() => expect(toastStatus().textContent).toBe(SUCCESS));
    expect(formStatus().textContent).toBe('');
    screen
      .getAllByRole('textbox')
      .forEach((field) => expect((field as HTMLInputElement).value).toBe(''));
    expect(privacyBox().checked).toBe(false);
    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: 'Submit' })
    );
  });

  test('the success toast stays until the user types again', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    renderForm();
    fillValid();
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => expect(toastStatus().textContent).toBe(SUCCESS));

    act(() => vi.advanceTimersByTime(30000));
    expect(toastStatus().textContent).toBe(SUCCESS);

    const name = screen.getByRole('textbox', { name: 'Name' });
    fireEvent.focus(name);
    fireEvent.blur(name);
    expect(toastStatus().textContent).toBe(SUCCESS);

    fireEvent.change(name, { target: { value: 'A' } });
    expect(toastStatus().textContent).toBe('');
  });

  test('a failed send is announced inline, with no toast', async () => {
    mocks.fetchData.mockResolvedValue({ success: false });
    renderForm();
    fillValid();
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() =>
      expect(formStatus().textContent).toContain("your message wasn't sent")
    );
    expect(toastStatus().textContent).toBe('');
    expect(screen.queryByRole('button', { name: 'Close notice' })).toBeNull();
  });

  test('leaving a field without typing keeps the error', async () => {
    mocks.fetchData.mockResolvedValue({ success: false });
    renderForm();
    fillValid();
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() =>
      expect(formStatus().textContent).toContain("your message wasn't sent")
    );

    const email = screen.getByRole('textbox', { name: 'Email' });
    fireEvent.focus(email);
    fireEvent.blur(email);
    expect(formStatus().textContent).toContain("your message wasn't sent");

    fireEvent.change(email, { target: { value: 'ada@example.com' } });
    expect(formStatus().textContent).toBe('');
  });
});

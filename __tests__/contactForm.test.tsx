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
import { Dictionary, EnContent } from '@/models';

import ContactForm from '@/app/[locale]/contact/components/ContactForm/ContactForm';

const en = new Dictionary(EnContent);

const mocks = vi.hoisted(() => ({
  getRecaptchaToken: vi.fn(),
  loadRecaptcha: vi.fn(),
  fetchData: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/en/contact',
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

const renderForm = () =>
  render(
    <LanguageProvider locale='en' content={en}>
      <ContactForm />
    </LanguageProvider>
  );

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
};

beforeEach(() => {
  mocks.getRecaptchaToken.mockResolvedValue('fresh-token');
  mocks.fetchData.mockResolvedValue({ success: true });
  mocks.loadRecaptcha.mockResolvedValue(undefined);
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.useRealTimers();
});

describe('ContactForm reCAPTCHA', () => {
  test('loads reCAPTCHA on the first focus, not on render', () => {
    renderForm();
    expect(mocks.loadRecaptcha).not.toHaveBeenCalled();

    fireEvent.focus(screen.getByRole('textbox', { name: 'Name' }));

    expect(mocks.loadRecaptcha).toHaveBeenCalled();
  });
});

describe('ContactForm accessibility', () => {
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
    expect(mocks.fetchData.mock.calls[0][1].body.recaptchaToken).toBe(
      'fresh-token'
    );

    // While sending the button keeps focus and is named.
    const sending = screen.getByRole('button', { name: 'Sending…' });
    expect(sending.getAttribute('aria-disabled')).toBe('true');
    expect(sending.hasAttribute('disabled')).toBe(false);
    expect(document.activeElement).toBe(sending);

    await act(async () => resolveFetch({ success: true }));
    expect(screen.getByRole('status').textContent).toBe(
      'The form was submitted successfully!'
    );
  });

  test('the success message stays until the user types again', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    renderForm();
    fillValid();
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() =>
      expect(screen.getByRole('status').textContent).toBe(
        'The form was submitted successfully!'
      )
    );

    act(() => vi.advanceTimersByTime(30000));
    expect(screen.getByRole('status').textContent).toBe(
      'The form was submitted successfully!'
    );

    fireEvent.change(screen.getByRole('textbox', { name: 'Name' }), {
      target: { value: 'A' },
    });
    expect(screen.getByRole('status').textContent).toBe('');
  });

  test('a failed send is announced in the status region', async () => {
    mocks.fetchData.mockResolvedValue({ success: false });
    renderForm();
    fillValid();
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() =>
      expect(screen.getByRole('status').textContent).toContain(
        "your message wasn't sent"
      )
    );
  });
});

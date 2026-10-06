import { describe, expect, test } from 'vitest';
import { getTextInputError } from '@/hooks/useTextInput';
import { serverFormValidations } from '@/utils/server/form.utils';

describe('Contact form validation', () => {
  test.each([
    ["O'Brien", null],
    ['Jean-Luc Picard', null],
    ['José María', null],
    ['Al', 'invalid'],
    ['R2D2', 'invalid'],
    ['', 'empty'],
  ])('name %j -> %s', (value, expected) => {
    expect(getTextInputError('text', value)).toBe(expected);
  });

  test.each([
    ['ada+site@gmail.com', null],
    ['hola@studio.studio', null],
    ['not-an-email', 'invalid'],
  ])('email %j -> %s', (value, expected) => {
    expect(getTextInputError('email', value)).toBe(expected);
  });

  test('messages may contain line breaks', () => {
    const message = 'First paragraph.\n\nSecond paragraph.';
    expect(getTextInputError('textarea', message)).toBeNull();
    expect(
      serverFormValidations.contactForm(
        "Ada O'Brien",
        'ada+site@gmail.com',
        message
      )
    ).toBe(true);
  });
});

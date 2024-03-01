import { fieldLength } from '@/utils/constants';
import { ContactFormField } from '@/models/enums';

export class Field {
  minLength?: number;
  maxLength?: number;
  value: string;
  focused: boolean;
  isValid: boolean;

  constructor(
    minLength?: number,
    maxLength?: number,
    value?: string,
    focused?: boolean,
    isValid?: boolean
  ) {
    this.minLength = minLength;
    this.maxLength = maxLength;
    this.value = value || '';
    this.focused = focused || false;
    this.isValid = isValid || false;
  }
}

export class ContactFormModel {
  [ContactFormField.NAME]: Field;
  [ContactFormField.EMAIL]: Field;
  [ContactFormField.MESSAGE]: Field;

  constructor(name?: Field, email?: Field, message?: Field) {
    this[ContactFormField.NAME] =
      name || new Field(fieldLength.text.min, fieldLength.text.max);
    this[ContactFormField.EMAIL] = email || new Field();
    this[ContactFormField.MESSAGE] =
      message || new Field(fieldLength.textarea.min, fieldLength.textarea.max);
  }
}

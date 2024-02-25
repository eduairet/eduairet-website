import { ContactFormField } from '../enums';

export class Field {
  value: string;
  focused: boolean;
  isValid: boolean;

  constructor(value?: string, focused?: boolean, isValid?: boolean) {
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
    this[ContactFormField.NAME] = name || new Field();
    this[ContactFormField.EMAIL] = email || new Field();
    this[ContactFormField.MESSAGE] = message || new Field();
  }
}

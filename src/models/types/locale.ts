import { Dictionary } from '../index';

export type Lang = 'en' | 'es';

export type Dictionaries = {
  // eslint-disable-next-line unused-imports/no-unused-vars
  [key in Lang]: () => Promise<Dictionary>;
};

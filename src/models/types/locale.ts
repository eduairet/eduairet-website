/* eslint-disable no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */

import { Dictionary } from '@/models';

export type Lang = 'en' | 'es';

export type Dictionaries = {
  [key in Lang]: Dictionary;
};

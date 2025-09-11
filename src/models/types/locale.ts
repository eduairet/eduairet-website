import { Dictionary } from '@/models';

export type Lang = 'en' | 'es';

export type Dictionaries = {
  [key in Lang]: Dictionary;
};

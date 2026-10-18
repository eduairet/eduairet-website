import { Fragment, type ReactNode } from 'react';
import { EMAIL_ADDRESS, POSTAL_ADDRESS, SocialUrls } from '@/utils/constants';

type FillPlaceholder = (key: string) => ReactNode;

// Splitting on a captured {key} puts the keys on the odd indexes.
export const fillTemplate = (text: string, fill: FillPlaceholder) =>
  text
    .split(/\{(\w+)\}/)
    .map((part, i) => <Fragment key={i}>{i % 2 ? fill(part) : part}</Fragment>);

export const contactDetail = (key: string) => {
  if (key === 'address') return POSTAL_ADDRESS;
  if (key === 'email') return <a href={SocialUrls.email}>{EMAIL_ADDRESS}</a>;
  return null;
};

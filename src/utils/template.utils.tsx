import { Fragment, type ReactNode } from 'react';

// eslint-disable-next-line no-unused-vars
type FillPlaceholder = (key: string) => ReactNode;

// Fills the {key} placeholders of dictionary copy. Splitting on a captured
// {key} puts the keys at the odd indexes.
export const fillTemplate = (text: string, fill: FillPlaceholder) =>
  text
    .split(/\{(\w+)\}/)
    .map((part, i) => <Fragment key={i}>{i % 2 ? fill(part) : part}</Fragment>);

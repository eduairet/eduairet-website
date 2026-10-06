'use client';

import { useContext } from 'react';
import { LanguageContext } from '@/store/LanguageProvider';

export default function Custom404() {
  const { content } = useContext(LanguageContext);

  // not-found.js can't export metadata, so React 19 hoists this <title>.
  return (
    <div>
      <title>{content.meta.notFound.title}</title>
      <h1>{content.notFound.title}</h1>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import EnContent from '@/models/dictionaries/en.json';
import EsContent from '@/models/dictionaries/es.json';
import { LanguageClientContent } from '@/models';

export default function useLanguage() {
  const { locale } = useParams();
  const [content, setContent] = useState<LanguageClientContent>(
    new LanguageClientContent()
  );

  useEffect(() => {
    if (locale === 'es')
      setContent(new LanguageClientContent(EsContent.client));
    else setContent(new LanguageClientContent(EnContent.client));
  }, [locale]);

  return { locale: locale as string, content };
}

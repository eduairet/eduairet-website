'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { LanguageClientContent, EnContent, EsContent } from '@/models';

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

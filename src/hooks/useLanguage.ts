'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Dictionary, EnContent, EsContent, Lang } from '@/models';

export default function useLanguage() {
  const { locale } = useParams();
  const [content, setContent] = useState<Dictionary>(new Dictionary());

  useEffect(() => {
    if (locale === 'es') setContent(new Dictionary(EsContent));
    else setContent(new Dictionary(EnContent));
  }, [locale]);

  return { locale: locale as Lang, content };
}

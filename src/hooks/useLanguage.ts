'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Dictionary, EnContent, EsContent, Lang } from '@/models';

export default function useLanguage() {
  const { locale } = useParams();
  const [content, setContent] = useState<Dictionary>(new Dictionary());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    if (locale === 'es') setContent(new Dictionary(EsContent));
    else setContent(new Dictionary(EnContent));
    setIsLoading(false);
  }, [locale]);

  return { locale: locale as Lang, isLoading, content };
}

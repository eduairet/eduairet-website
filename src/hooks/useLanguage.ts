'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Dictionary, EnContent, EsContent, Lang } from '@/models';

export default function useLanguage() {
  const { locale: localeParam } = useParams();
  const locale = (typeof localeParam === 'string' ? localeParam : 'en') as Lang;

  const content = useMemo(
    () => new Dictionary(locale === 'es' ? EsContent : EnContent),
    [locale]
  );

  return { locale, isLoading: false, content };
}

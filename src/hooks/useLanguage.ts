'use client';

import { useParams } from 'next/navigation';

export default function useLanguage() {
  const { locale } = useParams();
  return locale as string;
}

import type { Metadata } from 'next';
import { headers } from 'next/headers';
import type { MetaProps } from '@/models';
import { getDictionary } from '@/app/[locale]/dictionaries';
import { getHost } from '.';

export async function generateMetadata({
  params,
}: MetaProps): Promise<Metadata> {
  const { locale } = params;
  const content = await getDictionary(locale);

  const headersList = headers();
  let pathname = headersList.get('x-pathname') || '';
  pathname = pathname.replace(`/${locale}`, '').replace(/\//g, '');

  let title, description;
  try {
    title = content.meta[pathname].title;
    description = content.meta[pathname].description;
  } catch (_) {
    title = content.meta.default.title;
    description = content.meta.default.description;
  }

  return {
    metadataBase: new URL(getHost()),
    title: `${title} | eat`,
    description,
  };
}

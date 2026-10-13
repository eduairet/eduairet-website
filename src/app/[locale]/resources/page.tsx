import { notFound } from 'next/navigation';
import { getDictionary } from '@/app/[locale]/dictionaries';
import { RESOURCES_PUBLISHED } from '@/utils/constants';
import type { LocaleProps } from '@/models';
import { buildPageMetadata } from '@/utils/server';

export async function generateMetadata({ params }: LocaleProps) {
  return RESOURCES_PUBLISHED
    ? buildPageMetadata((await params).locale, 'resources')
    : {};
}

export default async function Resources({ params }: LocaleProps) {
  if (!RESOURCES_PUBLISHED) notFound();

  const locale = (await params).locale;
  const content = await getDictionary(locale);
  return (
    <div>
      <h1>{content.resources.title}</h1>
      <p>{content.resources.text}</p>
    </div>
  );
}

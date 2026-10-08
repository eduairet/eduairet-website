import { notFound } from 'next/navigation';
import { getDictionary } from '@/app/[locale]/dictionaries';
import { RESOURCES_PUBLISHED } from '@/utils/constants';
import {
  buildNotFoundMetadata,
  buildPageMetadata,
  type LocaleParams,
} from '@/utils/server';

export async function generateMetadata({ params }: LocaleParams) {
  const locale = (await params).locale;
  return RESOURCES_PUBLISHED
    ? buildPageMetadata(locale, 'resources')
    : buildNotFoundMetadata(locale);
}

export default async function Resources({ params }: LocaleParams) {
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

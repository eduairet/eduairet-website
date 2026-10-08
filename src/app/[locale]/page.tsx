import { getDictionary } from './dictionaries';
import HomeContent from '@/app/[locale]/components/HomeContent/HomeContent';
import JsonLd from '@/components/metadata/JsonLd';
import {
  buildHomeStructuredData,
  buildPageMetadata,
  type LocaleProps,
} from '@/utils/server';

export async function generateMetadata({ params }: LocaleProps) {
  return buildPageMetadata((await params).locale, 'home');
}

export default async function Home({ params }: LocaleProps) {
  const locale = (await params).locale;
  const content = await getDictionary(locale);
  return (
    <>
      <JsonLd data={await buildHomeStructuredData(locale)} />
      <HomeContent content={content} />
    </>
  );
}

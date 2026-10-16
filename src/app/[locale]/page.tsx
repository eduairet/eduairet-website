import { getDictionary, toLang } from './dictionaries';
import HomeContent from '@/app/[locale]/components/HomeContent/HomeContent';
import JsonLd from '@/components/metadata/JsonLd';
import PageTransition from '@/components/wrappers/PageTransition/PageTransition';
import type { LocaleProps } from '@/models';
import { buildHomeStructuredData, buildPageMetadata } from '@/utils/server';

export async function generateMetadata({ params }: LocaleProps) {
  return buildPageMetadata((await params).locale, 'home');
}

export default async function Home({ params }: LocaleProps) {
  const locale = toLang((await params).locale);
  const content = await getDictionary(locale);
  return (
    <>
      <JsonLd data={await buildHomeStructuredData(locale)} />
      <PageTransition>
        <HomeContent locale={locale} content={content} />
      </PageTransition>
    </>
  );
}

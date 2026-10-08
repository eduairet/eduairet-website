import { getDictionary } from './dictionaries';
import HomeContent from '@/app/[locale]/components/HomeContent/HomeContent';

interface IProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function Home({ params }: IProps) {
  const locale = (await params).locale;
  const content = await getDictionary(locale);
  return <HomeContent content={content} />;
}

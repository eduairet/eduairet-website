import { Lang } from '@/models';
import { getDictionary } from './dictionaries';
import HomeContent from '@/components/pages/HomeContent/HomeContent';

interface IProps {
  params: {
    locale: string;
  };
}

export default async function Home({ params: { locale } }: IProps) {
  const content = await getDictionary(locale as Lang);

  return <HomeContent content={content} />;
}

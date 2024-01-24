import HomeContent from '@/components/pages/home/HomeContent/HomeContent';
import { Lang } from '@/models';

interface IProps {
  params: {
    locale: string;
  };
}

export default function Home({ params: { locale } }: IProps) {
  return <HomeContent lang={locale as Lang} />;
}

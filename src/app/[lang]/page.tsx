import HomeContent from '@/components/pages/home/HomeContent/HomeContent';
import { Lang } from '@/models';

interface IProps {
  params: {
    lang: string;
  };
}

export default function Home({ params: { lang } }: IProps) {
  return <HomeContent lang={lang as Lang} />;
}

import { Lang } from '@/models';
import { getDictionary } from './dictionaries';

interface IProps {
  params: {
    locale: string;
  };
}

export default async function Home({ params: { locale } }: IProps) {
  const content = await getDictionary(locale as Lang);

  return (
    <>
      <h1 className='title'>Eduardo Aire Torres</h1>
      <h2 className='subtitle'>{content.home.subtitle}</h2>
    </>
  );
}

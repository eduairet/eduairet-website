import { getDictionary } from '@/app/[locale]/dictionaries';
import { Lang } from '@/models';

export { generateMetadata } from '@/utils/server';

interface IProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function Resources({ params }: IProps) {
  const locale = (await params).locale;
  const content = await getDictionary(locale as Lang);
  return (
    <div>
      <h1>{content.resources.title}</h1>
      <p>{content.resources.text}</p>
    </div>
  );
}

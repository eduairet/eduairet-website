import { notFound } from 'next/navigation';
import { getDictionary } from '@/app/[locale]/dictionaries';

export { generateMetadata } from '@/utils/server';

// Not published yet: the page returns 404 until there are resources to list.
// To publish it, set this to true and add a nav link in NavMainMenu.
const RESOURCES_PUBLISHED = false;

interface IProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function Resources({ params }: IProps) {
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

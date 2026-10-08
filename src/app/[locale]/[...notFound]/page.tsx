import { notFound } from 'next/navigation';
import { buildNotFoundMetadata, type LocaleParams } from '@/utils/server';

export async function generateMetadata({ params }: LocaleParams) {
  return buildNotFoundMetadata((await params).locale);
}

const CatchAll = () => notFound();
export default CatchAll;

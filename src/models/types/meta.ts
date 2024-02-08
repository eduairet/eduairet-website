import { Lang } from '.';

export type MetaProps = {
  params: { locale: Lang };
  searchParams?: { [key: string]: string | string[] | undefined };
};

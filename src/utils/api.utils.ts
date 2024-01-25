import { headers } from 'next/headers';

export const getLocalHost = () => {
  const host = headers().get('host');
  const protocol = process?.env.NODE_ENV === 'development' ? 'http' : 'https';
  return `${protocol}://${host}`;
};

export const getData = async (url: string) => {
  const res = await fetch(url);
  if (res.ok) {
    const data = await res.json();
    return data;
  }
  throw new Error('Error fetching data');
};

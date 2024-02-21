import { headers } from 'next/headers';
import { RequestInit } from 'next/dist/server/web/spec-extension/request';

export const getHost = () => {
  const host = headers().get('host');
  const protocol = process?.env.NODE_ENV === 'development' ? 'http' : 'https';
  return `${protocol}://${host}`;
};

interface IOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: {
    'Content-Type'?: string;
  };
  body?: unknown;
}

export const fetchData = async (
  url: string,
  {
    method = 'GET',
    headers = {
      'Content-Type': 'application/json',
    },
    body = {},
  }: IOptions = {}
) => {
  const res = await fetch(url, {
    method,
    headers,
    body: JSON.stringify(body),
  } as RequestInit);

  if (!res.ok) throw new Error('Error fetching data');
  const data = await res.json();
  return data;
};

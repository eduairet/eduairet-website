'use client';

import { RequestInit } from 'next/dist/server/web/spec-extension/request';
import { ApiResponse } from '@/models';

interface IOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: {
    'Content-Type'?: string;
  };
  body?: unknown;
}

export const fetchData = async <Type>(
  url: string,
  {
    method = 'GET',
    headers = {
      'Content-Type': 'application/json',
    },
    body = {},
  }: IOptions = {}
): Promise<ApiResponse<Type>> => {
  const res = await fetch(url, {
    method,
    headers,
    body: JSON.stringify(body),
  } as RequestInit);

  if (!res.ok) return new ApiResponse(res.statusText, false);
  const data: Type = await res.json();
  return new ApiResponse('Success', true, data);
};

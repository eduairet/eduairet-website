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
  options: IOptions = {}
): Promise<ApiResponse<Type>> => {
  const { method, headers, body } = options;

  const res = await fetch(url, {
    method: method || 'GET',
    headers: headers || { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  } as RequestInit);

  if (!res.ok) return new ApiResponse(res.statusText, false);
  const data: Type = await res.json();
  return new ApiResponse('Success', true, data);
};

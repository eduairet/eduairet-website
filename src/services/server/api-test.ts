import { getHost, fetchData } from '@/utils/server';

export const checkHealth = async () => {
  const host = getHost();
  const res = await fetchData<string>(`${host}/api/`);
  return res.message;
};

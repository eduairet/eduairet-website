import { getHost, fetchData } from '@/utils/server';

export const checkHealth = async () => {
  try {
    const host = getHost();
    const data = await fetchData(`${host}/api/`);
    if (data) return data.message;
  } catch (error) {
    throw new Error("We couldn't connect to the server.");
  }
};

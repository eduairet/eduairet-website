import { getHost, getData } from '@/utils/api.utils';

export const checkHealth = async () => {
  try {
    const host = getHost();
    const data = await getData(`${host}/api/`);
    if (data) return data.message;
  } catch (error) {
    throw new Error("We couldn't connect to the server.");
  }
};

import { getHost, getData } from '@/utils/api.utils';

export const getYear = async () => {
  try {
    const host = getHost();
    const data = await getData(`${host}/api/date?year=true`);
    if (data) return data.year;
  } catch (error) {
    throw new Error("We couldn't get the year");
  }
};

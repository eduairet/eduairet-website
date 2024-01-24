import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiDateRequest, ApiDateResponse } from '@/models/types';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiDateResponse>
) {
  const { query } = req;
  const { year, month, day } = query as unknown as ApiDateRequest;
  if (year && month && day) {
    return res.status(200).json({
      message: new Date().toISOString(),
    });
  }
  if (year && month) {
    return res.status(200).json({
      message: new Date().toISOString(),
    });
  }
  if (year) {
    return res.status(200).json({
      message: new Date().toISOString(),
    });
  }
  return res.status(400).json({
    message: 'Invalid request',
  });
}

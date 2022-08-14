import type { NextApiRequest, NextApiResponse } from 'next';

export type NextApiRequestWithUserId = NextApiRequest & {
  userId: string;
};

export type NextApiHandlerWithUserId<T = any> = (
  req: NextApiRequestWithUserId,
  res: NextApiResponse<T>
) => void | Promise<void>;

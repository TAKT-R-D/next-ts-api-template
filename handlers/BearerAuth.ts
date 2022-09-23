import { NextApiRequest, NextApiResponse } from 'next';
import { verify } from 'jsonwebtoken';
import { err401, err406, err500 } from '../lib/ErrorMessages';

type NextApiRequestWithUserId = NextApiRequest & {
  userId: string;
};
type AuthenticatedNextApiHandler<T = any> = (
  req: NextApiRequestWithUserId,
  res: NextApiResponse<T>
) => void | Promise<void>;

export const authenticated = (handler: AuthenticatedNextApiHandler) => {
  return (req: NextApiRequestWithUserId, res: NextApiResponse) => {
    const authHeader: string | undefined = req.headers.authorization;
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, OPTIONS, DELETE, PUT'
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }

    // click jacking attack
    res.setHeader('X-FRAME-OPTIONS', 'DENY');

    if (authHeader === undefined || authHeader.split(' ')[0] !== 'Bearer') {
      return res.status(406).json(err406);
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json(err500);
    }

    verify(
      authHeader.split(' ')[1],
      process.env.JWT_SECRET,
      async (err, decoded) => {
        if (!err && decoded && typeof decoded !== 'string') {
          req['userId'] = decoded.userId;
          return await handler(req, res);
        } else {
          return res.status(401).json(err401);
        }
      }
    );
    return handler(req, res);
  };
};

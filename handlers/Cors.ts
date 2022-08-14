import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

export const cors = (handler: NextApiHandler) => {
  return (req: NextApiRequest, res: NextApiResponse) => {
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

    return handler(req, res);
  };
};

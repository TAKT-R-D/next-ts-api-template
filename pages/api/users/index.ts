import type { NextApiResponse } from 'next';
import type {
  NextApiRequestWithUserId,
  NextApiHandlerWithUserId,
} from '../../../types/RequestType';
import { prisma } from '../../../lib/Prisma';
import type { User } from '@prisma/client';
import { authenticated } from '../../../handlers/BearerAuth';
import type { ErrType } from '../../../types/ErrorType';
import { err405, err500 } from '../../../lib/ErrorMessages';

const getHandler = async (
  req: NextApiRequestWithUserId,
  res: NextApiResponse<User[] | ErrType>
) => {
  let statusCode = 200;
  const resBody: User[] | ErrType = await prisma.user
    .findMany({
      orderBy: [{ id: 'desc' }],
    })
    .catch((err) => {
      console.error(err);
      statusCode = 500;
      return err500;
    })
    .finally(async () => prisma.$disconnect());

  return res.status(statusCode).json(resBody);
};

const handler: NextApiHandlerWithUserId = (
  req: NextApiRequestWithUserId,
  res: NextApiResponse
) => {
  switch (req.method) {
    case 'GET':
      getHandler(req, res);
      break;
    default:
      return res.status(405).json(err405);
  }
};

export default authenticated(handler);

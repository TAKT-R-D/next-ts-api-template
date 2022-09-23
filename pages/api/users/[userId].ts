import type { NextApiResponse } from 'next';
import type {
  NextApiRequestWithUserId,
  NextApiHandlerWithUserId,
} from '../../../types/RequestType';
import { prisma } from '../../../lib/Prisma';
import type { User } from '@prisma/client';
import { authenticated } from '../../../handlers/BearerAuth';
import type { ErrType } from '../../../types/ErrorType';
import { err400, err405, err500 } from '../../../lib/ErrorMessages';

const getHandler = async (
  req: NextApiRequestWithUserId,
  res: NextApiResponse<User | ErrType | null>
) => {
  const { userId } = Array.isArray(req.query) ? req.query[0] : req.query;
  let statusCode = 200;
  const resBody: User | ErrType | null = await prisma.user
    .findUnique({
      where: { userId },
    })
    .then((res) => {
      if (res === null) statusCode = 204;
      return res;
    })
    .catch((err) => {
      console.error(err);
      statusCode = 500;
      return err500;
    })
    .finally(async () => prisma.$disconnect());

  return res.status(statusCode).json(resBody);
};

const putHandler = async (
  req: NextApiRequestWithUserId,
  res: NextApiResponse<User | ErrType>
) => {
  const { userId } = Array.isArray(req.query) ? req.query[0] : req.query;
  let statusCode = 200;
  let resBody: User | ErrType;
  if (Object.keys(req.body).length === 0) {
    statusCode = 400;
    resBody = err400;
  } else {
    resBody = await prisma.user
      .update({
        where: { userId },
        data: req.body,
      })
      .catch((err) => {
        console.error(err);
        statusCode = 500;
        return err500;
      })
      .finally(async () => prisma.$disconnect());
  }

  return res.status(statusCode).json(resBody);
};

const deleteHandler = async (
  req: NextApiRequestWithUserId,
  res: NextApiResponse<null | ErrType>
) => {
  const { userId } = Array.isArray(req.query) ? req.query[0] : req.query;
  let statusCode = 204;
  const resBody: null | ErrType = await prisma.user
    .delete({
      where: { userId },
    })
    .then((res) => {
      return null;
    })
    .catch((err) => {
      console.error(err);
      statusCode = 500;
      return err500;
    })
    .finally(async () => prisma.$disconnect());

  return res.status(statusCode).json(resBody);
};

const handler: NextApiHandlerWithUserId = async (
  req: NextApiRequestWithUserId,
  res: NextApiResponse
) => {
  switch (req.method) {
    case 'GET':
      await getHandler(req, res);
      break;
    case 'PUT':
      await putHandler(req, res);
      break;
    case 'DELETE':
      await deleteHandler(req, res);
      break;
    default:
      return await res.status(405).json(err405);
      break;
  }
};

export default authenticated(handler);

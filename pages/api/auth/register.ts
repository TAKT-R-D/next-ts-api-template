import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { cors } from '../../../handlers/Cors';
import { prisma } from '../../../lib/Prisma';
import { Prisma } from '@prisma/client';
import { sign } from 'jsonwebtoken';
import { err400, err401, err405, err500 } from '../../../lib/ErrorMessages';
import type {
  RegisterPropsType,
  RegisterResType,
} from '../../../types/AuthType';
import type { ErrType } from '../../../types/ErrorType';
import { v4 as uuidv4 } from 'uuid';

const postHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<RegisterResType | ErrType>
) => {
  const { secret, name }: RegisterPropsType = req.body;
  if (!process.env.TRUST_API_SECRET || !process.env.JWT_SECRET)
    return res.status(500).json(err500);
  if (!secret || !name) return res.status(400).json(err400);
  if (secret !== process.env.TRUST_API_SECRET)
    return res.status(401).json(err401);

  const data: Prisma.UserCreateInput = {
    userId: uuidv4(),
    name,
  };
  const user = await prisma.user
    .create({ data })
    .finally(async () => prisma.$disconnect());

  if (!user) return res.status(204).end();

  const access_token = sign(
    {
      userId: user.userId,
      userName: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: '6h' }
  );

  return res.status(200).json({ access_token, user });
};

const handler: NextApiHandler = (req, res) => {
  switch (req.method) {
    case 'POST':
      postHandler(req, res);
      break;
    default:
      return res.status(405).json(err405);
  }
};

export default cors(handler);

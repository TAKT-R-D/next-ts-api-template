import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { cors } from '../../../handlers/Cors';
import { prisma } from '../../../lib/Prisma';
import { sign } from 'jsonwebtoken';
import { err400, err401, err405, err500 } from '../../../lib/ErrorMessages';
import type { AuthPropsType, AuthResType } from '../../../types/AuthType';
import type { ErrType } from '../../../types/ErrorType';

const postHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<AuthResType | ErrType>
) => {
  const { secret, userId }: AuthPropsType = req.body;
  if (!process.env.TRUST_API_SECRET || !process.env.JWT_SECRET)
    return res.status(500).json(err500);
  if (!secret || !userId) return res.status(400).json(err400);
  if (secret !== process.env.TRUST_API_SECRET)
    return res.status(401).json(err401);

  const user = await prisma.user
    .findUnique({
      where: { userId },
    })
    .finally(async () => prisma.$disconnect());

  if (!user) return res.status(204).end();

  const access_token = sign(
    {
      userId: userId,
      userName: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: '6h' }
  );

  return res.status(200).json({ access_token });
};

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case 'POST':
      await postHandler(req, res);
      break;
    default:
      return await res.status(405).json(err405);
      break;
  }
};

export default cors(handler);

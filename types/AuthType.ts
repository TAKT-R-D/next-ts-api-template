import type { User } from '@prisma/client';

export type AuthPropsType = {
  secret: string;
  userId: string;
};

export type AuthResType = {
  access_token: string;
};

export type RegisterPropsType = {
  secret: string;
  name: string;
  deviceId: string;
};

export type RegisterResType = {
  access_token: string;
  user: User;
};

import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const main = async () => {
  let userCreateInput: Prisma.UserCreateInput = {
    userId: '897f2ddf-eb33-4b6e-a74f-1c045e3d61d9',
    name: 'Sample User',
    description: 'Sample Description',
  };
  await prisma.user.upsert({
    where: { userId: userCreateInput.userId },
    update: {},
    create: userCreateInput,
  });
};

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

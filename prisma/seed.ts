import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({ data: { id: 1 } });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })

  .catch(async (e) => {
    console.error(e); // eslint-disable-line no-console
    await prisma.$disconnect();
    process.exit(1);
  });

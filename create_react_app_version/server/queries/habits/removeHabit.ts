import prisma from '../prismaClient';

export default async function removeHabit(habitId: number) {
  // only read first instead of getting old values from delete query so the function is idempotent
  // https://www.prisma.io/docs/guides/performance-and-optimization/prisma-client-transactions-guide#idempotent-apis
  const habitToDelete = await prisma.habit.findUnique({
    where: {
      id: habitId,
    },
    select: {
      order: true,
      user_id: true,
    },
  });

  if (habitToDelete === null) {
    throw new Error('no habit with that id exists');
  }

  return prisma.$transaction([
    prisma.habit.delete({
      where: {
        id: habitId,
      },
    }),
    prisma.habit.updateMany({
      where: {
        user_id: habitToDelete.user_id,
        order: { gt: habitToDelete.order },
      },
      data: {
        order: { decrement: 1 },
      },
    }),
  ]);
}

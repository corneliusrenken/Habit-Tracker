import prisma from '../prismaClient';

export default function getAllHabits(userId: number) {
  return prisma.habit.findMany({
    where: {
      user_id: userId,
    },
    orderBy: {
      order: 'asc',
    },
    select: {
      id: true,
      name: true,
      order: true,
    },
  });
}

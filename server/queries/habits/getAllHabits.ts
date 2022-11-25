import prisma from '../prismaClient';

export default function getAllHabits(userId: number) {
  return prisma.habit.findMany({
    where: {
      user_id: userId,
    },
    orderBy: {
      id: 'asc',
    },
    select: {
      id: true,
      name: true,
      selected: true,
      order: true,
    },
  });
}

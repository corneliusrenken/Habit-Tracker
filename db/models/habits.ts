import prisma from '..';

export function addHabit(userId: number, name: string, order: number) {
  return prisma.habit.create({
    data: {
      user_id: userId,
      name,
      order,
    },
    select: {
      id: true,
      name: true,
      order: true,
      selected: true,
    },
  });
}

export function deleteHabit(habitId: number) {
  return prisma.habit.delete({
    where: {
      id: habitId,
    },
  });
}

export function getHabits(userId: number) {
  return prisma.habit.findMany({
    where: {
      user_id: {
        equals: userId,
      },
    },
    orderBy: {
      id: 'asc',
    },
    select: {
      id: true,
      name: true,
      order: true,
      selected: true,
    },
  });
}

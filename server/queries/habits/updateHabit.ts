import { Habit } from '@prisma/client';
import prisma from '../prismaClient';

export default async function updateHabit(
  habitId: number,
  data: Partial<Omit<Habit, 'id' | 'user_id'>>,
) {
  let { name, order } = data;

  const habitPreUpdate = await prisma.habit.findUnique({
    where: {
      id: habitId,
    },
    select: {
      user_id: true,
      name: true,
      order: true,
    },
  });

  if (habitPreUpdate === null) {
    throw new Error('no habit with that id exists');
  }

  const userId = habitPreUpdate.user_id;
  name = habitPreUpdate.name !== name ? name : undefined;
  order = habitPreUpdate.order !== order ? order : undefined;

  const operations = [];

  operations.push(
    prisma.habit.update({
      where: {
        id: habitId,
      },
      data: {
        name,
        order,
      },
      select: {
        id: true,
        name: true,
        order: true,
      },
    }),
  );

  if (order !== undefined) {
    const habitCount = await prisma.habit.count({
      where: {
        user_id: userId,
      },
    });

    if (order < 0 || order >= habitCount) {
      throw new Error('Invalid order value: User\'s order values must uniquely exist between 0 and habit count - 1 inclusively');
    }

    const orderDifference = order - habitPreUpdate.order;

    if (orderDifference > 0) {
      operations.push(
        prisma.habit.updateMany({
          where: {
            id: { not: habitId },
            user_id: userId,
            order: { gt: habitPreUpdate.order, lte: order },
          },
          data: {
            order: { decrement: 1 },
          },
        }),
      );
    } else {
      operations.push(
        prisma.habit.updateMany({
          where: {
            id: { not: habitId },
            user_id: userId,
            order: { lt: habitPreUpdate.order, gte: order },
          },
          data: {
            order: { increment: 1 },
          },
        }),
      );
    }
  }

  const transactionResult = await prisma.$transaction(operations);

  return transactionResult[0];
}

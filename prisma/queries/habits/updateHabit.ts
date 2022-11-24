import { Habit } from '@prisma/client';
import prisma from '../prismaClient';
import addOccurrences from '../occurrences/addOccurrences';
import removeOccurrence from '../occurrences/removeOccurrence';

export default async function updateHabit(
  habitId: number,
  data: Partial<Omit<Habit, 'id' | 'user_id'>>,
  dateString: string,
) {
  let { name, selected, order } = data;

  const habitPreUpdate = await prisma.habit.findUnique({
    where: {
      id: habitId,
    },
    select: {
      user_id: true,
      name: true,
      order: true,
      selected: true,
    },
  });

  if (habitPreUpdate === null) {
    throw new Error('no habit with that id exists');
  }

  const userId = habitPreUpdate.user_id;
  name = habitPreUpdate.name !== name ? name : undefined;
  order = habitPreUpdate.order !== order ? order : undefined;
  selected = habitPreUpdate.selected !== selected ? selected : undefined;

  const operations = [];

  operations.push(
    prisma.habit.update({
      where: {
        id: habitId,
      },
      data: {
        name,
        order,
        selected,
      },
      select: {
        id: true,
        name: true,
        selected: true,
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

  if (selected !== undefined) {
    // when changing to true -- need to add false occurrence for current date
    if (selected === true) {
      operations.push(addOccurrences([{ habitId, dateString, completed: false }]));
    // when changing to false -- need to remove occurrence for current date
    } else {
      operations.push(removeOccurrence(habitId, dateString));
    }
  }

  const transactionResult = await prisma.$transaction(operations);

  return transactionResult[0];
}

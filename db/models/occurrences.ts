import prisma from '..';

export function addOccurrence(habitId: number, date: string) {
  return prisma.occurrence.create({
    data: {
      date,
      habit_id: habitId,
    },
  });
}

export function deleteOccurrence(habitId: number, date: string) {
  return prisma.occurrence.delete({
    where: {
      date_habit_id: { date, habit_id: habitId },
    },
  });
}

import prisma from '../prismaClient';

export default function updateOccurrence(habitId: number, dateString: string, completed: boolean) {
  return prisma.occurrence.update({
    where: {
      date_habit_id: {
        date: `${dateString}T00:00:00Z`,
        habit_id: habitId,
      },
    },
    data: {
      completed,
    },
    select: {
      habit_id: true,
      date: true,
      completed: true,
    },
  });
}

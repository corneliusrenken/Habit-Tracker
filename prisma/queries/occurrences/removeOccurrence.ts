import prisma from '../prismaClient';

export default function removeOccurrence(habitId: number, dateString: string) {
  return prisma.occurrence.delete({
    where: {
      date_habit_id: {
        habit_id: habitId,
        date: `${dateString}T00:00:00Z`,
      },
    },
  });
}

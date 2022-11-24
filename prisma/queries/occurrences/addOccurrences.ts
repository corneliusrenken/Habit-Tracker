import prisma from '../prismaClient';

type OccurrenceData = {
  habitId: number;
  completed: boolean;
  dateString: string;
};

export default function addOccurrences(occurrences: OccurrenceData[]) {
  return prisma.occurrence.createMany({
    data: occurrences.map(({ habitId, dateString, completed }) => ({
      habit_id: habitId,
      date: `${dateString}T00:00:00Z`,
      completed,
    })),
  });
}

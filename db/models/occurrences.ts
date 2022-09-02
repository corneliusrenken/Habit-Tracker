import prisma from '..';

type OccRange = Promise<Array<{ dates: { [key: string]: Array<number> } }>>;

export function getOccurrences(userId: number, fromDate: string, toDate: string): OccRange {
  return prisma.$queryRaw`
    SELECT
      COALESCE(
        JSON_OBJECT_AGG(date, habits)
      FILTER (WHERE date IS NOT NULL), '{}') AS dates
    FROM (
      SELECT
        date AS date,
        JSON_AGG(habit_id ORDER BY habit_id ASC) AS habits
      FROM
        occurrences
      JOIN
        habits
      ON
        occurrences.habit_id = habits.id
      WHERE
        user_id = ${userId}
      AND
        date >= TO_DATE(${fromDate}, 'YYYY-MM-DD')
      AND
        date <= TO_DATE(${toDate}, 'YYYY-MM-DD')
      GROUP BY date
    ) AS agg
  `;
}

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

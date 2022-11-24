import prisma from '../prismaClient';

type ReturnType = {
  [dateString: string]: {
    [habitId: string]: boolean;
  };
};

type QueryResult = {
  occurrences: ReturnType;
}[];

export default async function getOccurrencesByDate(userId: number): Promise<ReturnType> {
  const queryResult: QueryResult = await prisma.$queryRaw`
    WITH occurrences_grouped_to_dates AS (
      SELECT
        to_char(date, 'YYYY-MM-DD') as date,
        json_object_agg(habit_id, completed) as occurrence
      FROM
        occurrences
      JOIN
        habits
      ON
        occurrences.habit_id = habits.id
      WHERE
        user_id = ${userId}
      GROUP BY
        date
    )
    SELECT
      COALESCE(
        json_object_agg(
          date,
          occurrence
        )
      FILTER (WHERE date IS NOT NULL), '{}') AS occurrences
    FROM
      occurrences_grouped_to_dates
  `;

  return queryResult[0].occurrences;
}

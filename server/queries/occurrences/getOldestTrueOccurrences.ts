import prisma from '../prismaClient';

type ReturnType = {
  [habitId: string]: string | undefined;
};

type QueryResult = {
  oldest_occurrences: ReturnType;
}[];

// plan:
// have objects with key habit id, value array of dates
// have objects with key habit id, value MINIMUM of array of dates!

export default async function getOldestTrueOccurrences(userId: number): Promise<ReturnType> {
  const queryResult: QueryResult = await prisma.$queryRaw`
    WITH minimum_date_grouped_to_habit_id AS (
      SELECT
        habits.id AS habit_id,
        to_char(min(date), 'YYYY-MM-DD') AS minimum_date
      FROM
        occurrences
      RIGHT JOIN
        habits
      ON
        occurrences.habit_id = habits.id
      AND
        occurrences.completed = true
      WHERE
        user_id = ${userId}
      GROUP BY
        habits.id
    )
    SELECT
      COALESCE(
        json_object_agg(
          habit_id,
          minimum_date
        )
      FILTER (WHERE habit_id IS NOT NULL), '{}') AS oldest_occurrences
    FROM
      minimum_date_grouped_to_habit_id
  `;

  return queryResult[0].oldest_occurrences;
}

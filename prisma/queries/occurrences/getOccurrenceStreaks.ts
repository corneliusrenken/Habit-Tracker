import prisma from '../prismaClient';

type ReturnType = {
  [habitId: string]: {
    current: number;
    maximum: number;
  };
};

type QueryResult = {
  streaks: ReturnType;
}[];

export default async function getOccurrenceStreaks(
  userId: number,
  dateString: string,
): Promise<ReturnType> {
  const queryResult: QueryResult = await prisma.$queryRaw`
    WITH user_occurrences AS (
      SELECT
        occurrences.date,
        habits.id AS habit_id
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
    ), streaks AS (
      SELECT
        habit_id,
        min(date) AS streak_beginning,
        max(date) AS streak_end,
        max(date) - min(date) + 1 AS streak_length
      FROM
        (select user_occurrences.*,
            row_number() over (partition by habit_id order by date) as seqnum
          from user_occurrences
        ) user_occurrences
      group by habit_id, date - seqnum * interval '1 day'
      order by habit_id, count(*) desc
    ), current_streaks AS (
      SELECT
        streak_length AS current_streak,
        habit_id
      FROM
        streaks
      WHERE
        streak_end = TO_DATE(${dateString}, 'YYYY-MM-DD')
      OR
        streak_end = TO_DATE(${dateString}, 'YYYY-MM-DD') - INTERVAL '1 DAY'
    ), max_streaks AS (
      SELECT
        habit_id,
        COALESCE(
          max(streak_length), 0
        ) AS max_streak
      FROM
        streaks
      GROUP BY habit_id
    ), pre_agg AS (
      SELECT
        max_streaks.habit_id,
        COALESCE(
          current_streak, 0
        ) AS current,
        max_streak AS maximum
      FROM
        current_streaks
      RIGHT JOIN
        max_streaks
      ON
        current_streaks.habit_id = max_streaks.habit_id
    )
    SELECT
      COALESCE(
        JSON_OBJECT_AGG(habit_id, json_build_object('current', current, 'maximum', maximum))
      FILTER (WHERE habit_id IS NOT NULL), '{}') AS streaks
    FROM
      pre_agg
  `;

  return queryResult[0].streaks;
}

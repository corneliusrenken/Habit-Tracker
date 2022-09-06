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

// eslint-disable-next-line max-len
type OccStreaks = Promise<Array<{ streaks: { [key: string]: { current: number, maximum: number } } }>>;

export function getOccurrenceStreaks(userId: number, date: string): OccStreaks {
  return prisma.$queryRaw`
    WITH user_occurrences AS (
      SELECT
        occurrences.date,
        habits.id AS habit_id
      FROM
        occurrences
      RIGHT JOIN
        habits
      ON
        user_id = ${userId}
      AND
        occurrences.habit_id = habits.id
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
        streak_end = TO_DATE(${date}, 'YYYY-MM-DD')
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
}

// max_streaks.habit_id,
// COALESCE(
//   current_streak, 0
// ) AS current,
// max_streak AS maximum

// JSON_OBJECT_AGG(max_streaks.habit_id, json_build_object('current',
// COALESCE(current_streak, 0), 'maximum', max_streak))

// max_streaks.habit_id, (
//   SELECT
//     rows
//   FROM (
//     SELECT
//       COALESCE(
//         current_streak, 0
//       ) AS current,
//       max_streak AS maximum
//   ) AS rows
// )

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

import { Database } from 'better-sqlite3';

/**
 * @param date "YYYY-MM-DD" — used to calculate current streak
 */
export default function getOccurrenceStreaks(database: Database, date: string): {
  [habitId: string]: {
    current: number;
    maximum: number;
  };
} {
  const getOccurrenceStreaksStmt = database.prepare(`
    WITH occurrences_with_date AS (
      SELECT habit_id, date
      FROM occurrences
      LEFT JOIN days
      ON occurrences.day_id = days.id
      WHERE date <= ? AND visible = 1 AND complete = 1
    ), occurrences_with_seqnum AS (
      SELECT
        *,
        ROW_NUMBER() OVER (PARTITION BY habit_id ORDER BY date) as seqnum
      FROM occurrences_with_date
    ), streaks AS (
      SELECT
        habit_id,
        min(date) AS streak_beginning,
        max(date) AS streak_end,
        julianday(max(date)) - julianday(min(date)) + 1 AS streak_length
      FROM occurrences_with_seqnum
      GROUP BY habit_id, JULIANDAY(date) - JULIANDAY(seqnum)
    ), current_streaks AS (
      SELECT habit_id, streak_length
      FROM streaks
      WHERE streak_end = ? OR streak_end = date(?, '-1 day')
    ), max_streaks AS (
      SELECT habit_id, max(streak_length) AS streak_length
      FROM streaks
      GROUP BY habit_id
    )
    SELECT
      json_group_object(
        habits.id,
        json_object(
          'maximum',
          IFNULL(max_streaks.streak_length, 0),
          'current',
          IFNULL(current_streaks.streak_length, 0)
        )
      ) AS habit_ids
    FROM habits
    LEFT JOIN max_streaks
    ON habits.id = max_streaks.habit_id
    LEFT JOIN current_streaks
    ON habits.id = current_streaks.habit_id
  `);

  return JSON.parse(getOccurrenceStreaksStmt.get(date, date, date).habit_ids);
}

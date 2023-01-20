import { Database } from 'better-sqlite3';

/**
 * @returns if not null, the returned date is formatted as "YYYY-MM-DD"
 */
export default function getOldestVisibleOccurrenceDates(database: Database): {
  [habitId: string]: null | string
} {
  const getOldestVisibleOccurrenceDatesStmt = database.prepare(`
    WITH oldest_occurrences AS (
      SELECT habit_id, min(date) AS oldest_occurrence
      FROM occurrences
      LEFT JOIN days
      ON occurrences.day_id = days.id
      WHERE visible = 1
      GROUP BY habit_id
    )
    SELECT json_group_object(habits.id, oldest_occurrence) AS oldest_occurrences
    FROM habits
    LEFT JOIN oldest_occurrences
    ON habits.id = oldest_occurrences.habit_id
  `);

  return JSON.parse(getOldestVisibleOccurrenceDatesStmt.get().oldest_occurrences);
}

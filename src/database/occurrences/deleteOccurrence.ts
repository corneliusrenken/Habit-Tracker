import { Database } from 'better-sqlite3';

/**
 * @param date "YYYY-MM-DD"
 */
export default function deleteOccurrence(database: Database, habitId: number, date: string) {
  const getOccurrenceStmt = database.prepare(`
    SELECT occurrences.id
    FROM occurrences
    LEFT JOIN days
    ON occurrences.day_id = days.id
    WHERE date = ? AND habit_id = ?
  `);

  const occurrenceBeforeDeletion = getOccurrenceStmt.get(date, habitId);

  if (occurrenceBeforeDeletion === undefined) {
    throw new Error('Error: No occurrence matches the given habit id / date');
  }

  const deleteOccurrenceStmt = database.prepare(`
    DELETE FROM occurrences
    WHERE id = ?
  `);

  deleteOccurrenceStmt.run(occurrenceBeforeDeletion.id);
}

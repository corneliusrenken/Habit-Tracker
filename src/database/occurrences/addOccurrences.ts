import { Database } from 'better-sqlite3';

/**
 * @param date "YYYY-MM-DD"
 */
export default function addOccurrences(
  database: Database,
  options: { habitIds: number[], date: string },
) {
  const { habitIds, date } = options;

  if (habitIds.length === 0) return;

  const insertOccurrencesStmt = database.prepare(`
    INSERT INTO occurrences (habit_id, day_id)
    VALUES
      ${habitIds.map(() => '(?, (SELECT id FROM days WHERE date = ?))').join(',')}
  `);

  insertOccurrencesStmt.run(...habitIds.flatMap((habitId) => [habitId, date]));
}

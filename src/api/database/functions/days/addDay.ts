import { Database } from 'better-sqlite3';

/**
 * @param date "YYYY-MM-DD"
 */
export default function addDay(database: Database, options: { date: string }) {
  const { date } = options;

  const addDayStmt = database.prepare('INSERT INTO days (date) VALUES (?)');

  addDayStmt.run(date);
}

import { Database } from 'better-sqlite3';

/**
 * @param date "YYYY-MM-DD"
 */
export default function addDay(database: Database, date: string) {
  const addDayStmt = database.prepare('INSERT INTO days (date) VALUES (?)');

  addDayStmt.run(date);
}

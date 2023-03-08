import { Database } from 'better-sqlite3';

export default function getHabits(database: Database): {
  id: number;
  name: string;
}[] {
  const getHabitsStmt = database.prepare(`
    SELECT id, name
    FROM habits
    ORDER BY list_position
  `);

  return getHabitsStmt.all();
}

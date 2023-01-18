import { Database } from 'better-sqlite3';

export default function getHabits(database: Database): {
  id: number;
  name: string;
  order_index: number;
}[] {
  const getHabitsStmt = database.prepare(`
    SELECT id, name, order_index
    FROM habits
    ORDER BY order_index
  `);

  return getHabitsStmt.all();
}

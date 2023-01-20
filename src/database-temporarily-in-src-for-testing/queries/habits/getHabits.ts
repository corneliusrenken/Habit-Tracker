import { Database } from 'better-sqlite3';

export default function getHabits(database: Database): {
  id: number;
  name: string;
  order_in_list: number;
}[] {
  const getHabitsStmt = database.prepare(`
    SELECT id, name, order_in_list
    FROM habits
    ORDER BY order_in_list
  `);

  return getHabitsStmt.all();
}

import { Database } from 'better-sqlite3';

export default function getHabits(database: Database): {
  id: number;
  name: string;
  orderInList: number;
}[] {
  const getHabitsStmt = database.prepare(`
    SELECT id, name, order_in_list AS orderInList
    FROM habits
    ORDER BY order_in_list
  `);

  return getHabitsStmt.all();
}

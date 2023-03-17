import { Database } from 'better-sqlite3';

export default function checkValidListPositionValues(
  database: Database,
  expectedNameOrder?: string[],
) {
  const getOrderedHabitNameAndListPositionsStmt = database.prepare(`
    SELECT name, list_position as listPosition
    FROM habits
    ORDER BY list_position
  `);

  const habits = getOrderedHabitNameAndListPositionsStmt.all();

  for (let i = 0; i < habits.length; i += 1) {
    const { name, listPosition } = habits[i];
    if (listPosition !== i) return false;
    if (expectedNameOrder && name !== expectedNameOrder[i]) return false;
  }

  return true;
}

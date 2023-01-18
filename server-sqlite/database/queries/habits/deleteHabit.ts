import { Database } from 'better-sqlite3';
import { dropUniqueOrderIndexIx, setUniqueOrderIndexIx } from '../manageUniqueOrderIndexIx';

export default function deleteHabit(database: Database, habitId: number) {
  const getHabitByIdStmt = database.prepare('SELECT order_index FROM habits WHERE id = ?');

  const habitToDelete = getHabitByIdStmt.get(habitId);

  if (habitToDelete === undefined) {
    throw new Error('Error: No habit exists with this id');
  }

  const deleteHabitStmt = database.prepare('DELETE FROM habits WHERE id = ?');

  const fixOrderIndicesStmt = database.prepare(`
    UPDATE habits
    SET order_index = order_index - 1
    WHERE order_index > ?
  `);

  const deleteHabitAndFixOrderIndices = database.transaction(() => {
    deleteHabitStmt.run(habitId);
    dropUniqueOrderIndexIx(database);
    fixOrderIndicesStmt.run(habitToDelete.order_index);
    setUniqueOrderIndexIx(database);
  });

  deleteHabitAndFixOrderIndices();
}

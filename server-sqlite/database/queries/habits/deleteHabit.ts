import { Database } from 'better-sqlite3';
import { dropUniqueOrderInListIndex, setUniqueOrderInListIndex } from '../manageUniqueOrderInListIndex';

export default function deleteHabit(database: Database, habitId: number) {
  const getHabitByIdStmt = database.prepare('SELECT order_in_list FROM habits WHERE id = ?');

  const habitToDelete = getHabitByIdStmt.get(habitId);

  if (habitToDelete === undefined) {
    throw new Error('Error: No habit exists with this id');
  }

  const deleteHabitStmt = database.prepare('DELETE FROM habits WHERE id = ?');

  const shiftOrderInListValuesStmt = database.prepare(`
    UPDATE habits
    SET order_in_list = order_in_list - 1
    WHERE order_in_list > ?
  `);

  const deleteHabitAndShiftOrderInListValues = database.transaction(() => {
    deleteHabitStmt.run(habitId);
    dropUniqueOrderInListIndex(database);
    shiftOrderInListValuesStmt.run(habitToDelete.order_in_list);
    setUniqueOrderInListIndex(database);
  });

  deleteHabitAndShiftOrderInListValues();
}

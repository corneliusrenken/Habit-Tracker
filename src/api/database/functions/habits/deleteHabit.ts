import { Database } from 'better-sqlite3';
import dropUniqueIndexOnListPosition from '../common/dropUniqueIndexOnListPosition';
import setUniqueIndexOnListPosition from '../common/setUniqueIndexOnListPosition';

export default function deleteHabit(database: Database, options: { habitId: number }) {
  const { habitId } = options;

  const getHabitByIdStmt = database.prepare('SELECT list_position FROM habits WHERE id = ?');

  const habitToDelete = getHabitByIdStmt.get(habitId);

  if (habitToDelete === undefined) {
    throw new Error('No habit exists with this id');
  }

  const deleteHabitStmt = database.prepare('DELETE FROM habits WHERE id = ?');

  const shiftListPositionValuesStmt = database.prepare(`
    UPDATE habits
    SET list_position = list_position - 1
    WHERE list_position > ?
  `);

  const deleteHabitAndShiftListPositionValues = database.transaction(() => {
    deleteHabitStmt.run(habitId);
    dropUniqueIndexOnListPosition(database);
    shiftListPositionValuesStmt.run(habitToDelete.list_position);
    setUniqueIndexOnListPosition(database);
  });

  deleteHabitAndShiftListPositionValues();
}

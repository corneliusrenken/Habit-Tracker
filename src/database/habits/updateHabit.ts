import { Database } from 'better-sqlite3';
import dropUniqueIndexOnListPosition from '../common/dropUniqueIndexOnListPosition';
import setUniqueIndexOnListPosition from '../common/setUniqueIndexOnListPosition';

type UpdateData = ({
  name: string;
}) | ({
  listPosition: number;
});

export default function updateHabit(database: Database, habitId: number, updateData: UpdateData) {
  const getHabitByIdStmt = database.prepare('SELECT name, list_position FROM habits WHERE id = ?');

  const habitPreUpdate = getHabitByIdStmt.get(habitId);

  if (habitPreUpdate === undefined) {
    throw new Error('Error: No habit exists with this id');
  }

  if (('name' in updateData && habitPreUpdate.name === updateData.name)
  || ('listPosition' in updateData && habitPreUpdate.list_position === updateData.listPosition)) {
    return;
  }

  if ('name' in updateData) {
    const updateHabitNameStmt = database.prepare('UPDATE habits SET name = ? WHERE id = ?');
    updateHabitNameStmt.run(updateData.name, habitId);
    return;
  }

  const getHabitCountStmt = database.prepare('SELECT count(id) AS count FROM habits');
  const habitCount = getHabitCountStmt.get().count;

  if (updateData.listPosition < 0 || updateData.listPosition >= habitCount) {
    throw new Error('Error: List position is out of range. The value needs to inclusively be between 0 and the count of all habits - 1');
  }

  // can't be 0 as that would've been caught by the above if statement
  const shiftDirection = Math.sign(
    updateData.listPosition - habitPreUpdate.list_position,
  ) as 1 | -1;

  const shiftOtherListPositionValuesStmt = shiftDirection === 1
    ? database.prepare(`
      UPDATE habits
      SET list_position = list_position - 1
      WHERE list_position > ? AND list_position <= ?
    `)
    : database.prepare(`
      UPDATE habits
      SET list_position = list_position + 1
      WHERE list_position < ? AND list_position >= ?
    `);

  const updateListPositionStmt = database.prepare('UPDATE habits SET list_position = ? WHERE id = ?');

  const updateListPositionValues = database.transaction(() => {
    dropUniqueIndexOnListPosition(database);
    shiftOtherListPositionValuesStmt.run(habitPreUpdate.list_position, updateData.listPosition);
    updateListPositionStmt.run(updateData.listPosition, habitId);
    setUniqueIndexOnListPosition(database);
  });

  updateListPositionValues();
}

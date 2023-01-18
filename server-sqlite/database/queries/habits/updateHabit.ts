import { Database } from 'better-sqlite3';
import { dropUniqueOrderIndexIx, setUniqueOrderIndexIx } from '../manageUniqueOrderIndexIx';

type UpdateInfo = ({
  name: string;
}) | ({
  orderIndex: number;
});

export default function updateHabit(database: Database, habitId: number, updateInfo: UpdateInfo) {
  const getHabitByIdStmt = database.prepare('SELECT name, order_index FROM habits WHERE id = ?');

  const habitPreUpdate = getHabitByIdStmt.get(habitId);

  if (habitPreUpdate === undefined) {
    throw new Error('Error: No habit exists with this id');
  }

  if (('name' in updateInfo && habitPreUpdate.name === updateInfo.name)
  || ('orderIndex' in updateInfo && habitPreUpdate.order_index === updateInfo.orderIndex)) {
    return;
  }

  if ('name' in updateInfo) {
    const updateHabitNameStmt = database.prepare('UPDATE habits SET name = ? WHERE id = ?');
    updateHabitNameStmt.run(updateInfo.name, habitId);
    return;
  }

  const getHabitCountStmt = database.prepare('SELECT count(id) AS count FROM habits');
  const habitCount = getHabitCountStmt.get().count;

  if (updateInfo.orderIndex < 0 || updateInfo.orderIndex >= habitCount) {
    throw new Error('Error: Order index is out of range. The value needs to inclusively be between 0 and the count of all habits - 1');
  }

  const shiftDirection = Math.sign(updateInfo.orderIndex - habitPreUpdate.order_index) as 1 | -1;

  const shiftOtherHabitOrderIndicesStmt = shiftDirection === 1
    ? database.prepare(`
      UPDATE habits
      SET order_index = order_index - 1
      WHERE order_index > ? AND order_index <= ?
    `)
    : database.prepare(`
      UPDATE habits
      SET order_index = order_index + 1
      WHERE order_index < ? AND order_index >= ?
    `);

  const setUpdatedOrderIndexStmt = database.prepare('UPDATE habits SET order_index = ? WHERE id = ?');

  const reorderOrderIndices = database.transaction(() => {
    dropUniqueOrderIndexIx(database);
    shiftOtherHabitOrderIndicesStmt.run(habitPreUpdate.order_index, updateInfo.orderIndex);
    setUpdatedOrderIndexStmt.run(updateInfo.orderIndex, habitId);
    setUniqueOrderIndexIx(database);
  });

  reorderOrderIndices();
}

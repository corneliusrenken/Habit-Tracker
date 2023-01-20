import { Database } from 'better-sqlite3';
import dropUniqueOrderInListIndex from '../common/dropUniqueOrderInListIndex';
import setUniqueOrderInListIndex from '../common/setUniqueOrderInListIndex';

type UpdateData = ({
  name: string;
}) | ({
  orderInList: number;
});

export default function updateHabit(database: Database, habitId: number, updateData: UpdateData) {
  const getHabitByIdStmt = database.prepare('SELECT name, order_in_list FROM habits WHERE id = ?');

  const habitPreUpdate = getHabitByIdStmt.get(habitId);

  if (habitPreUpdate === undefined) {
    throw new Error('Error: No habit exists with this id');
  }

  if (('name' in updateData && habitPreUpdate.name === updateData.name)
  || ('orderInList' in updateData && habitPreUpdate.order_in_list === updateData.orderInList)) {
    return;
  }

  if ('name' in updateData) {
    const updateHabitNameStmt = database.prepare('UPDATE habits SET name = ? WHERE id = ?');
    updateHabitNameStmt.run(updateData.name, habitId);
    return;
  }

  const getHabitCountStmt = database.prepare('SELECT count(id) AS count FROM habits');
  const habitCount = getHabitCountStmt.get().count;

  if (updateData.orderInList < 0 || updateData.orderInList >= habitCount) {
    throw new Error('Error: Order in list is out of range. The value needs to inclusively be between 0 and the count of all habits - 1');
  }

  const shiftDirection = Math.sign(updateData.orderInList - habitPreUpdate.order_in_list) as 1 | -1;

  const shiftOtherOrderInListValuesStmt = shiftDirection === 1
    ? database.prepare(`
      UPDATE habits
      SET order_in_list = order_in_list - 1
      WHERE order_in_list > ? AND order_in_list <= ?
    `)
    : database.prepare(`
      UPDATE habits
      SET order_in_list = order_in_list + 1
      WHERE order_in_list < ? AND order_in_list >= ?
    `);

  const setUpdatedOrderInListStmt = database.prepare('UPDATE habits SET order_in_list = ? WHERE id = ?');

  const reorderOrderInListValues = database.transaction(() => {
    dropUniqueOrderInListIndex(database);
    shiftOtherOrderInListValuesStmt.run(habitPreUpdate.order_in_list, updateData.orderInList);
    setUpdatedOrderInListStmt.run(updateData.orderInList, habitId);
    setUniqueOrderInListIndex(database);
  });

  reorderOrderInListValues();
}

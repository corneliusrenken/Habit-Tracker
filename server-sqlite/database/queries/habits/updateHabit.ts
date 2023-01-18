import { Database } from 'better-sqlite3';
import { dropUniqueOrderInListIndex, setUniqueOrderInListIndex } from '../manageUniqueOrderInListIndex';

type UpdateInfo = ({
  name: string;
}) | ({
  orderInList: number;
});

export default function updateHabit(database: Database, habitId: number, updateInfo: UpdateInfo) {
  const getHabitByIdStmt = database.prepare('SELECT name, order_in_list FROM habits WHERE id = ?');

  const habitPreUpdate = getHabitByIdStmt.get(habitId);

  if (habitPreUpdate === undefined) {
    throw new Error('Error: No habit exists with this id');
  }

  if (('name' in updateInfo && habitPreUpdate.name === updateInfo.name)
  || ('orderInList' in updateInfo && habitPreUpdate.order_in_list === updateInfo.orderInList)) {
    return;
  }

  if ('name' in updateInfo) {
    const updateHabitNameStmt = database.prepare('UPDATE habits SET name = ? WHERE id = ?');
    updateHabitNameStmt.run(updateInfo.name, habitId);
    return;
  }

  const getHabitCountStmt = database.prepare('SELECT count(id) AS count FROM habits');
  const habitCount = getHabitCountStmt.get().count;

  if (updateInfo.orderInList < 0 || updateInfo.orderInList >= habitCount) {
    throw new Error('Error: Order in list is out of range. The value needs to inclusively be between 0 and the count of all habits - 1');
  }

  const shiftDirection = Math.sign(updateInfo.orderInList - habitPreUpdate.order_in_list) as 1 | -1;

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
    shiftOtherOrderInListValuesStmt.run(habitPreUpdate.order_in_list, updateInfo.orderInList);
    setUpdatedOrderInListStmt.run(updateInfo.orderInList, habitId);
    setUniqueOrderInListIndex(database);
  });

  reorderOrderInListValues();
}

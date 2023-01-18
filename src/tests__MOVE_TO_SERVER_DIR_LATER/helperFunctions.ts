import { Database } from 'better-sqlite3';
import getHabits from '../../server-sqlite/database/queries/habits/getHabits';

// eslint-disable-next-line import/prefer-default-export
export function verifyOrderIndices(database: Database, expectedNameOrder?: string[]) {
  const habits = getHabits(database);

  habits.forEach((habit, index) => {
    const { name, order_index } = habit;
    expect(order_index).toBe(index);
    if (expectedNameOrder) {
      expect(name).toBe(expectedNameOrder[index]);
    }
  });
}

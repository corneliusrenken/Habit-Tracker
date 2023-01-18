import { Database } from 'better-sqlite3';
import getHabits from '../../server-sqlite/database/queries/habits/getHabits';

// eslint-disable-next-line import/prefer-default-export
export function verifyOrderIndices(database: Database) {
  const habits = getHabits(database);

  habits.forEach(({ order_index }, index) => {
    expect(order_index).toBe(index);
  });
}

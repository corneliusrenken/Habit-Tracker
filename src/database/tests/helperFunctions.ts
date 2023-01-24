import { Database } from 'better-sqlite3';
import { getHabits } from '../queries';

// eslint-disable-next-line import/prefer-default-export
export function verifyOrderInListValues(database: Database, expectedNameOrder?: string[]) {
  const habits = getHabits(database);

  habits.forEach((habit, index) => {
    const { name, orderInList } = habit;
    expect(orderInList).toBe(index);
    if (expectedNameOrder) {
      expect(name).toBe(expectedNameOrder[index]);
    }
  });
}

import Database from 'better-sqlite3';
import {
  addHabit,
  createTables,
  openDatabase,
  updateHabit,
} from '../../queries';
import { verifyOrderInListValues } from '../helperFunctions';

let db: Database.Database;
let originalHabit: {
  id: number;
  name: string;
  order_in_list: number;
};

beforeEach(() => {
  db = openDatabase(':memory:');
  createTables(db);
  const addDayStmt = db.prepare('INSERT INTO days (date) VALUES (?)');
  addDayStmt.run('2023-01-17');
  originalHabit = addHabit(db, 'exercise', '2023-01-17');
});

afterEach(() => {
  db.close();
});

test('doesn\'t throw when the changed value is the same as the original', () => {
  expect(() => updateHabit(db, originalHabit.id, { name: 'exercise' })).not.toThrow();
  expect(() => updateHabit(db, originalHabit.id, { orderInList: 0 })).not.toThrow();
});

test('throws an error if the habit to update does not exist', () => {
  expect(() => updateHabit(db, 1234, { name: 'new name' })).toThrow('Error: No habit exists with this id');
  expect(() => updateHabit(db, 1234, { orderInList: 1 })).toThrow('Error: No habit exists with this id');
});

describe('updating name', () => {
  test('throws an error if the new name value already exists', () => {
    addHabit(db, 'read', '2023-01-17');
    expect(() => updateHabit(db, originalHabit.id, { name: 'read' })).toThrow('UNIQUE constraint failed: habits.name');
  });

  test('throws an error if the new name is invalid', () => {
    addHabit(db, 'read', '2023-01-17');
    expect(() => updateHabit(db, originalHabit.id, { name: '' })).toThrow('CHECK constraint failed: name NOT IN (\'\')');
  });

  test('updates the habit\'s name, and only the habit\'s name', () => {
    updateHabit(db, originalHabit.id, { name: 'read' });

    const getHabitByIdStmt = db.prepare('SELECT name, order_in_list FROM habits WHERE id = ?');

    const updatedHabit = getHabitByIdStmt.get(originalHabit.id);

    expect(updatedHabit.name).toBe('read');
    expect(updatedHabit.order_in_list).toBe(originalHabit.order_in_list);
  });
});

describe('updating order in list', () => {
  let readHabitId: number;
  let sleepHabitId: number;

  beforeEach(() => {
    readHabitId = addHabit(db, 'read', '2023-01-17').id;
    sleepHabitId = addHabit(db, 'sleep', '2023-01-17').id;
  });

  test('throws an error if the new order in list is out of range (less than 0 or greater than habit length - 1)', () => {
    expect(() => updateHabit(db, originalHabit.id, { orderInList: -1 })).toThrow('Error: Order in list is out of range. The value needs to inclusively be between 0 and the count of all habits - 1');
    expect(() => updateHabit(db, originalHabit.id, { orderInList: 3 })).toThrow('Error: Order in list is out of range. The value needs to inclusively be between 0 and the count of all habits - 1');
  });

  test('updates the habit\'s order in list, and only the order in list', () => {
    updateHabit(db, originalHabit.id, { orderInList: 2 });

    const getHabitByIdStmt = db.prepare('SELECT name, order_in_list FROM habits WHERE id = ?');

    const updatedHabit = getHabitByIdStmt.get(originalHabit.id);

    expect(updatedHabit.order_in_list).toBe(2);
    expect(updatedHabit.name).toBe(originalHabit.name);
  });

  test('when updating order in list, all other habit\'s order in list values shift in the opposite direction to keep the uninterrupted order range from 0 -> length of habits - 1', () => {
    // original order: ['exercise', 'read', 'sleep']
    updateHabit(db, originalHabit.id, { orderInList: 1 }); // order from 0 -> 1
    verifyOrderInListValues(db, ['read', 'exercise', 'sleep']);
    updateHabit(db, originalHabit.id, { orderInList: 0 }); // revert -> 0
    updateHabit(db, originalHabit.id, { orderInList: 2 }); // order from 0 -> 2
    verifyOrderInListValues(db, ['read', 'sleep', 'exercise']);
    updateHabit(db, originalHabit.id, { orderInList: 0 }); // revert -> 0
    updateHabit(db, readHabitId, { orderInList: 0 }); // order from 1 -> 0
    verifyOrderInListValues(db, ['read', 'exercise', 'sleep']);
    updateHabit(db, readHabitId, { orderInList: 1 }); // revert -> 1
    updateHabit(db, readHabitId, { orderInList: 2 }); // order from 1 -> 2
    verifyOrderInListValues(db, ['exercise', 'sleep', 'read']);
    updateHabit(db, readHabitId, { orderInList: 1 }); // revert -> 1
    updateHabit(db, sleepHabitId, { orderInList: 0 }); // order from 2 -> 0
    verifyOrderInListValues(db, ['sleep', 'exercise', 'read']);
    updateHabit(db, sleepHabitId, { orderInList: 2 }); // revert -> 2
    updateHabit(db, sleepHabitId, { orderInList: 1 }); // order from 2 -> 1
    verifyOrderInListValues(db, ['exercise', 'sleep', 'read']);
  });
});

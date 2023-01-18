import Database from 'better-sqlite3';
import createTables from '../../server-sqlite/database/queries/createTables';
import addHabit from '../../server-sqlite/database/queries/habits/addHabit';
import updateHabit from '../../server-sqlite/database/queries/habits/updateHabit';
import { verifyOrderInListValues } from './helperFunctions';

let db: Database.Database;
let exerciseHabitId: number;

beforeEach(() => {
  db = new Database(':memory:');
  createTables(db);
  const addDayStmt = db.prepare('INSERT INTO days (date) VALUES (?)');
  addDayStmt.run('2023-01-17');
  exerciseHabitId = addHabit(db, 'exercise', '2023-01-17').id;
});

afterEach(() => {
  db.close();
});

test('doesn\'t throw when the changed value is the same as the original', () => {
  expect(() => updateHabit(db, exerciseHabitId, { name: 'exercise' })).not.toThrow();
  expect(() => updateHabit(db, exerciseHabitId, { orderInList: 0 })).not.toThrow();
});

test('throws an error if the habit to update does not exist', () => {
  expect(() => updateHabit(db, 1234, { name: 'new name' })).toThrow('Error: No habit exists with this id');
  expect(() => updateHabit(db, 1234, { orderInList: 1 })).toThrow('Error: No habit exists with this id');
});

describe('updating name', () => {
  test('throws an error if the new name value already exists', () => {
    addHabit(db, 'read', '2023-01-17');
    expect(() => updateHabit(db, exerciseHabitId, { name: 'read' })).toThrow('UNIQUE constraint failed: habits.name');
  });

  test('throws an error if the new name is invalid', () => {
    addHabit(db, 'read', '2023-01-17');
    expect(() => updateHabit(db, exerciseHabitId, { name: '' })).toThrow('CHECK constraint failed: name NOT IN (\'\')');
  });

  test('updates the habit\'s name', () => {
    updateHabit(db, exerciseHabitId, { name: 'read' });

    const getHabitByIdStmt = db.prepare('SELECT name FROM habits WHERE id = ?');

    expect(getHabitByIdStmt.get(exerciseHabitId).name).toBe('read');
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
    expect(() => updateHabit(db, exerciseHabitId, { orderInList: -1 })).toThrow('Error: Order in list is out of range. The value needs to inclusively be between 0 and the count of all habits - 1');
    expect(() => updateHabit(db, exerciseHabitId, { orderInList: 3 })).toThrow('Error: Order in list is out of range. The value needs to inclusively be between 0 and the count of all habits - 1');
  });

  test('updates the habit\'s order in list', () => {
    updateHabit(db, exerciseHabitId, { orderInList: 2 });

    const getHabitByIdStmt = db.prepare('SELECT order_in_list FROM habits WHERE id = ?');

    expect(getHabitByIdStmt.get(exerciseHabitId).order_in_list).toBe(2);
  });

  test('when updating order in list, all other habit\'s order in list values shift in the opposite direction to keep the uninterrupted order range from 0 -> length of habits - 1', () => {
    // original order: ['exercise', 'read', 'sleep']
    updateHabit(db, exerciseHabitId, { orderInList: 1 }); // order from 0 -> 1
    verifyOrderInListValues(db, ['read', 'exercise', 'sleep']);
    updateHabit(db, exerciseHabitId, { orderInList: 0 }); // revert -> 0
    updateHabit(db, exerciseHabitId, { orderInList: 2 }); // order from 0 -> 2
    verifyOrderInListValues(db, ['read', 'sleep', 'exercise']);
    updateHabit(db, exerciseHabitId, { orderInList: 0 }); // revert -> 0
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

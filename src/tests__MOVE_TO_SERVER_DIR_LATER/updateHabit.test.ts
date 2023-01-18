import Database from 'better-sqlite3';
import createTables from '../../server-sqlite/database/queries/createTables';
import addHabit from '../../server-sqlite/database/queries/habits/addHabit';
import updateHabit from '../../server-sqlite/database/queries/habits/updateHabit';
import { verifyOrderIndices } from './helperFunctions';

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
  expect(() => updateHabit(db, exerciseHabitId, { orderIndex: 0 })).not.toThrow();
});

test('throws an error if the habit to update does not exist', () => {
  expect(() => updateHabit(db, 1234, { name: 'new name' })).toThrow('Error: No habit exists with this id');
  expect(() => updateHabit(db, 1234, { orderIndex: 1 })).toThrow('Error: No habit exists with this id');
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

describe('updating order', () => {
  let readHabitId: number;
  let sleepHabitId: number;

  beforeEach(() => {
    readHabitId = addHabit(db, 'read', '2023-01-17').id;
    sleepHabitId = addHabit(db, 'sleep', '2023-01-17').id;
  });

  test('throws an error if the new order index is out of range (less than 0 or greater than habit length - 1)', () => {
    expect(() => updateHabit(db, exerciseHabitId, { orderIndex: -1 })).toThrow('Error: Order index is out of range. The value needs to inclusively be between 0 and the count of all habits - 1');
    expect(() => updateHabit(db, exerciseHabitId, { orderIndex: 3 })).toThrow('Error: Order index is out of range. The value needs to inclusively be between 0 and the count of all habits - 1');
  });

  test('updates the habit\'s order index', () => {
    updateHabit(db, exerciseHabitId, { orderIndex: 2 });

    const getHabitByIdStmt = db.prepare('SELECT order_index FROM habits WHERE id = ?');

    expect(getHabitByIdStmt.get(exerciseHabitId).order_index).toBe(2);
  });

  test('when updating order index, all other habit\'s order indices shift in the opposite direction to keep the uninterrupted order index range from 0 -> length of habits - 1', () => {
    // original order: ['exercise', 'read', 'sleep']
    updateHabit(db, exerciseHabitId, { orderIndex: 1 }); // order from 0 -> 1
    verifyOrderIndices(db, ['read', 'exercise', 'sleep']);
    updateHabit(db, exerciseHabitId, { orderIndex: 0 }); // revert -> 0
    updateHabit(db, exerciseHabitId, { orderIndex: 2 }); // order from 0 -> 2
    verifyOrderIndices(db, ['read', 'sleep', 'exercise']);
    updateHabit(db, exerciseHabitId, { orderIndex: 0 }); // revert -> 0
    updateHabit(db, readHabitId, { orderIndex: 0 }); // order from 1 -> 0
    verifyOrderIndices(db, ['read', 'exercise', 'sleep']);
    updateHabit(db, readHabitId, { orderIndex: 1 }); // revert -> 1
    updateHabit(db, readHabitId, { orderIndex: 2 }); // order from 1 -> 2
    verifyOrderIndices(db, ['exercise', 'sleep', 'read']);
    updateHabit(db, readHabitId, { orderIndex: 1 }); // revert -> 1
    updateHabit(db, sleepHabitId, { orderIndex: 0 }); // order from 2 -> 0
    verifyOrderIndices(db, ['sleep', 'exercise', 'read']);
    updateHabit(db, sleepHabitId, { orderIndex: 2 }); // revert -> 2
    updateHabit(db, sleepHabitId, { orderIndex: 1 }); // order from 2 -> 1
    verifyOrderIndices(db, ['exercise', 'sleep', 'read']);
  });
});

import Database from 'better-sqlite3';
import {
  addHabit,
  createTables,
  openDatabase,
  updateHabit,
} from '../../../database';
import checkValidListPositionValues from '../helperFunctions/checkValidListPositionValues';

let db: Database.Database;
let originalHabit: { id: number; name: string };

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
  expect(() => updateHabit(db, originalHabit.id, { listPosition: 0 })).not.toThrow();
});

test('throws an error if the habit to update does not exist', () => {
  expect(() => updateHabit(db, 1234, { name: 'new name' })).toThrow('Error: No habit exists with this id');
  expect(() => updateHabit(db, 1234, { listPosition: 1 })).toThrow('Error: No habit exists with this id');
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

    const getHabitByIdStmt = db.prepare('SELECT name, list_position FROM habits WHERE id = ?');

    const updatedHabit = getHabitByIdStmt.get(originalHabit.id);

    expect(updatedHabit.name).toBe('read');
    expect(updatedHabit.list_position).toBe(0);
  });
});

describe('updating list position', () => {
  let readHabitId: number;
  let sleepHabitId: number;

  beforeEach(() => {
    readHabitId = addHabit(db, 'read', '2023-01-17').id;
    sleepHabitId = addHabit(db, 'sleep', '2023-01-17').id;
  });

  test('throws an error if the new list position is out of range (less than 0 or greater than habit length - 1)', () => {
    expect(() => updateHabit(db, originalHabit.id, { listPosition: -1 })).toThrow('Error: List position is out of range. The value needs to inclusively be between 0 and the count of all habits - 1');
    expect(() => updateHabit(db, originalHabit.id, { listPosition: 3 })).toThrow('Error: List position is out of range. The value needs to inclusively be between 0 and the count of all habits - 1');
  });

  test('updates the habit\'s list position, and only the list position', () => {
    updateHabit(db, originalHabit.id, { listPosition: 2 });

    const getHabitByIdStmt = db.prepare('SELECT name, list_position FROM habits WHERE id = ?');

    const updatedHabit = getHabitByIdStmt.get(originalHabit.id);

    expect(updatedHabit.list_position).toBe(2);
    expect(updatedHabit.name).toBe(originalHabit.name);
  });

  test('when updating list position, all other habit\'s list position values shift in the opposite direction to keep the uninterrupted range from 0 -> length of habits - 1', () => {
    // original list position: ['exercise', 'read', 'sleep']
    updateHabit(db, originalHabit.id, { listPosition: 1 }); // list position from 0 -> 1
    expect(checkValidListPositionValues(db, ['read', 'exercise', 'sleep'])).toBe(true);
    updateHabit(db, originalHabit.id, { listPosition: 0 }); // revert -> 0
    updateHabit(db, originalHabit.id, { listPosition: 2 }); // list position from 0 -> 2
    expect(checkValidListPositionValues(db, ['read', 'sleep', 'exercise'])).toBe(true);
    updateHabit(db, originalHabit.id, { listPosition: 0 }); // revert -> 0
    updateHabit(db, readHabitId, { listPosition: 0 }); // list position from 1 -> 0
    expect(checkValidListPositionValues(db, ['read', 'exercise', 'sleep'])).toBe(true);
    updateHabit(db, readHabitId, { listPosition: 1 }); // revert -> 1
    updateHabit(db, readHabitId, { listPosition: 2 }); // list position from 1 -> 2
    expect(checkValidListPositionValues(db, ['exercise', 'sleep', 'read'])).toBe(true);
    updateHabit(db, readHabitId, { listPosition: 1 }); // revert -> 1
    updateHabit(db, sleepHabitId, { listPosition: 0 }); // list position from 2 -> 0
    expect(checkValidListPositionValues(db, ['sleep', 'exercise', 'read'])).toBe(true);
    updateHabit(db, sleepHabitId, { listPosition: 2 }); // revert -> 2
    updateHabit(db, sleepHabitId, { listPosition: 1 }); // list position from 2 -> 1
    expect(checkValidListPositionValues(db, ['exercise', 'sleep', 'read'])).toBe(true);
  });
});

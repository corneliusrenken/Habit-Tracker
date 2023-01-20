import Database from 'better-sqlite3';
import {
  addHabit,
  createTables,
  dropUniqueOrderInListIndex,
  getHabits,
  openDatabase,
  setUniqueOrderInListIndex,
} from '../../queries';
import { verifyOrderInListValues } from '../helperFunctions';

let db: Database.Database;

beforeEach(() => {
  db = openDatabase(':memory:');
  createTables(db);
  const addDayStmt = db.prepare('INSERT INTO days (date) VALUES (?)');
  addDayStmt.run('2023-01-17');
});

afterEach(() => {
  db.close();
});

test('returns an empty array if no  habits exist', () => {
  const habits = getHabits(db);
  expect(Array.isArray(habits)).toBe(true);
  expect(habits.length).toBe(0);
});

test('returns an array of objects, each containing the habit\'s id, name, and order_in_list', () => {
  addHabit(db, 'exercise', '2023-01-17');
  addHabit(db, 'read', '2023-01-17');
  addHabit(db, 'sleep', '2023-01-17');
  const habits = getHabits(db);
  habits.forEach((habit) => {
    expect(habit).toHaveProperty('id');
    expect(habit).toHaveProperty('name');
    expect(habit).toHaveProperty('order_in_list');
  });
});

test('returns habits in ascending \'order_in_list\' order', () => {
  addHabit(db, 'exercise', '2023-01-17');
  addHabit(db, 'read', '2023-01-17');
  addHabit(db, 'sleep', '2023-01-17');

  verifyOrderInListValues(db);

  const manuallyChangeOrderInList = db.prepare(`
    UPDATE habits
    SET order_in_list = ?
    WHERE name = ?
  `);

  const shuffleOrderIndices = db.transaction(() => {
    dropUniqueOrderInListIndex(db);
    manuallyChangeOrderInList.run(2, 'exercise');
    manuallyChangeOrderInList.run(0, 'sleep');
    setUniqueOrderInListIndex(db);
  });

  shuffleOrderIndices();

  verifyOrderInListValues(db);
});

import Database from 'better-sqlite3';
import createTables from '../../server-sqlite/database/queries/createTables';
import addHabit from '../../server-sqlite/database/queries/habits/addHabit';
import getHabits from '../../server-sqlite/database/queries/habits/getHabits';
import { dropUniqueOrderIndexIx, setUniqueOrderIndexIx } from '../../server-sqlite/database/queries/manageUniqueOrderIndexIx';
import { verifyOrderIndices } from './helperFunctions';

let db: Database.Database;

beforeEach(() => {
  db = new Database(':memory:');
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

test('returns an array of objects, each containing the habit\'s id, name, and order_index', () => {
  addHabit(db, 'exercise', '2023-01-17');
  addHabit(db, 'read', '2023-01-17');
  addHabit(db, 'sleep', '2023-01-17');
  const habits = getHabits(db);
  habits.forEach((habit) => {
    expect(habit).toHaveProperty('id');
    expect(habit).toHaveProperty('name');
    expect(habit).toHaveProperty('order_index');
  });
});

test('returns habits in ascending \'order_index\' order', () => {
  addHabit(db, 'exercise', '2023-01-17');
  addHabit(db, 'read', '2023-01-17');
  addHabit(db, 'sleep', '2023-01-17');

  verifyOrderIndices(db);

  const manuallyChangeOrderIndex = db.prepare(`
    UPDATE habits
    SET order_index = ?
    WHERE name = ?
  `);

  const shuffleOrderIndices = db.transaction(() => {
    dropUniqueOrderIndexIx(db);
    manuallyChangeOrderIndex.run(2, 'exercise');
    manuallyChangeOrderIndex.run(0, 'sleep');
    setUniqueOrderIndexIx(db);
  });

  shuffleOrderIndices();

  verifyOrderIndices(db);
});

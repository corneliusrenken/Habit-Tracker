import Database from 'better-sqlite3';
import {
  addHabit,
  createTables,
  dropUniqueIndexOnListPosition,
  getHabits,
  openDatabase,
  setUniqueIndexOnListPosition,
} from '../../../database';
import checkValidListPositionValues from '../helperFunctions/checkValidListPositionValues';

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

test('returns an array of objects, each containing the habit\'s id and name', () => {
  addHabit(db, { name: 'exercise', date: '2023-01-17' });
  addHabit(db, { name: 'read', date: '2023-01-17' });
  addHabit(db, { name: 'sleep', date: '2023-01-17' });
  const habits = getHabits(db);
  habits.forEach((habit) => {
    expect(habit).toHaveProperty('id');
    expect(habit).toHaveProperty('name');
  });
});

test('returns habits in ascending list position order', () => {
  addHabit(db, { name: 'exercise', date: '2023-01-17' });
  addHabit(db, { name: 'read', date: '2023-01-17' });
  addHabit(db, { name: 'sleep', date: '2023-01-17' });

  expect(checkValidListPositionValues(db, ['exercise', 'read', 'sleep'])).toBe(true);

  const manuallyChangeListPosition = db.prepare(`
    UPDATE habits
    SET list_position = ?
    WHERE name = ?
  `);

  const shuffleListPositions = db.transaction(() => {
    dropUniqueIndexOnListPosition(db);
    manuallyChangeListPosition.run(2, 'exercise');
    manuallyChangeListPosition.run(0, 'sleep');
    setUniqueIndexOnListPosition(db);
  });

  shuffleListPositions();

  expect(checkValidListPositionValues(db, ['sleep', 'read', 'exercise'])).toBe(true);
});

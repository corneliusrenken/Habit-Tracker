import Database from 'better-sqlite3';
import checkValidListPositionValues from './checkValidListPositionValues';
import {
  addHabit,
  createTables,
  openDatabase,
  dropUniqueIndexOnListPosition,
} from '../../../database';

let db: Database.Database;
let updateListPositionStmt: Database.Statement;

beforeEach(() => {
  db = openDatabase(':memory:');
  createTables(db);
  updateListPositionStmt = db.prepare('UPDATE habits SET list_position = ? WHERE name = ?');
  const addDayStmt = db.prepare('INSERT INTO days (date) VALUES (?)');
  addDayStmt.run('2023-02-12');
  addHabit(db, 'exercise', '2023-02-12');
  addHabit(db, 'read', '2023-02-12');
  addHabit(db, 'sleep', '2023-02-12');
});

afterEach(() => {
  db.close();
});

test('returns true for an empty list', () => {
  const deleteAllHabitsStmt = db.prepare('DELETE FROM habits');
  deleteAllHabitsStmt.run();
  expect(checkValidListPositionValues(db)).toBe(true);
});

test('returns true if only list position from 0 -> habit count - 1 are occupied, uniquely', () => {
  const getHabitListPositionStmt = db.prepare('SELECT list_position FROM habits ORDER BY list_position');
  const habits = getHabitListPositionStmt.all();
  habits.forEach(({ list_position }, index) => {
    expect(list_position).toBe(index);
  });
  expect(checkValidListPositionValues(db, ['exercise', 'read', 'sleep'])).toBe(true);
});

test('returns false if two habits have the same list position', () => {
  dropUniqueIndexOnListPosition(db);
  updateListPositionStmt.run(0, 'read');
  expect(checkValidListPositionValues(db)).toBe(false);
});

test('returns false if a list position below 0 exists', () => {
  updateListPositionStmt.run(-1, 'exercise');
  updateListPositionStmt.run(0, 'read');
  updateListPositionStmt.run(1, 'sleep');
  expect(checkValidListPositionValues(db)).toBe(false);
});

test('returns false if no list position value of 0 exists', () => {
  updateListPositionStmt.run(3, 'sleep');
  updateListPositionStmt.run(2, 'read');
  updateListPositionStmt.run(1, 'exercise');
  expect(checkValidListPositionValues(db)).toBe(false);
});

test('returns false if there is a gap in the range of acceptable list positions', () => {
  updateListPositionStmt.run(3, 'sleep');
  updateListPositionStmt.run(2, 'read');
  expect(checkValidListPositionValues(db)).toBe(false);
});

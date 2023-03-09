import Database from 'better-sqlite3';
import { addDay, createTables, openDatabase } from '../../../api/database/functions';

let db: Database.Database;

beforeEach(() => {
  db = openDatabase(':memory:');
  createTables(db);
});

afterEach(() => {
  db.close();
});

test('if the date is formatted in any way other than "YYYY-MM-DD, throw an error"', () => {
  expect(() => addDay(db, { date: '23-01-18' })).toThrow('CHECK constraint failed: date IS strftime(\'%Y-%m-%d\', date)');
  expect(() => addDay(db, { date: '18-01-2023' })).toThrow('CHECK constraint failed: date IS strftime(\'%Y-%m-%d\', date)');
  expect(() => addDay(db, { date: '2023/01/18' })).toThrow('CHECK constraint failed: date IS strftime(\'%Y-%m-%d\', date)');
  expect(() => addDay(db, { date: '20230118' })).toThrow('CHECK constraint failed: date IS strftime(\'%Y-%m-%d\', date)');
  expect(() => addDay(db, { date: 'anything' })).toThrow('CHECK constraint failed: date IS strftime(\'%Y-%m-%d\', date)');
});

test('if the days table already contains a day with the passed date, throw an error', () => {
  addDay(db, { date: '2023-01-18' });
  expect(() => addDay(db, { date: '2023-01-18' })).toThrow('UNIQUE constraint failed: days.date');
});

test('added day appears in the database correctly', () => {
  addDay(db, { date: '2023-01-18' });
  const getDaysStmt = db.prepare('SELECT date FROM days');
  const days = getDaysStmt.all();
  expect(days.length).toBe(1);
  expect(days[0].date).toBe('2023-01-18');
});

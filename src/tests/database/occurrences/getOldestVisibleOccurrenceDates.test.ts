import Database from 'better-sqlite3';
import {
  addDay,
  addOccurrences,
  createTables,
  getOldestVisibleOccurrenceDates,
  openDatabase,
  updateOccurrence,
} from '../../../api/database/functions';

let db: Database.Database;
let exerciseHabitId: number;

beforeEach(() => {
  db = openDatabase(':memory:');
  createTables(db);
  // can't use addHabit here as that automatically creates an occurrence for the day
  const addOnlyHabitStmt = db.prepare('INSERT INTO habits (name, list_position) VALUES (?, ?)');
  exerciseHabitId = Number(addOnlyHabitStmt.run('exercise', 0).lastInsertRowid);
  addDay(db, { date: '2023-01-17' });
  addDay(db, { date: '2023-01-18' });
  addDay(db, { date: '2023-01-19' });
});

afterEach(() => {
  db.close();
});

test('returns an empty objects if no habits exist', () => {
  const deleteAllHabitsStmt = db.prepare('DELETE FROM habits');
  deleteAllHabitsStmt.run();
  expect(getOldestVisibleOccurrenceDates(db)).toEqual({});
});

test('habit\'s oldest occurrence value is null if a habit has no related occurrences', () => {
  const occurrences = getOldestVisibleOccurrenceDates(db);
  expect(occurrences[exerciseHabitId]).toBe(null);
});

test('habit\'s oldest occurrence value is all related occurrences are not visible', () => {
  addOccurrences(db, { habitIds: [exerciseHabitId], date: '2023-01-17' });

  let occurrences = getOldestVisibleOccurrenceDates(db);
  expect(occurrences[exerciseHabitId]).toBe('2023-01-17');

  updateOccurrence(db, { habitId: exerciseHabitId, date: '2023-01-17', updateData: { visible: false } });
  occurrences = getOldestVisibleOccurrenceDates(db);
  expect(occurrences[exerciseHabitId]).toBe(null);
});

test('returns the oldest occurrence for a habit with a single visible occurrence', () => {
  addOccurrences(db, { habitIds: [exerciseHabitId], date: '2023-01-17' });
  const occurrences = getOldestVisibleOccurrenceDates(db);
  expect(occurrences[exerciseHabitId]).toBe('2023-01-17');
});

test('returns the oldest occurrence for a habit with a multiple visible occurrences', () => {
  addOccurrences(db, { habitIds: [exerciseHabitId], date: '2023-01-18' });
  addOccurrences(db, { habitIds: [exerciseHabitId], date: '2023-01-19' });
  const occurrences = getOldestVisibleOccurrenceDates(db);
  expect(occurrences[exerciseHabitId]).toBe('2023-01-18');
});

test('both complete or incomplete occurrences count as an oldest occurrence', () => {
  addOccurrences(db, { habitIds: [exerciseHabitId], date: '2023-01-17' });

  updateOccurrence(db, { habitId: exerciseHabitId, date: '2023-01-17', updateData: { complete: true } });
  let occurrences = getOldestVisibleOccurrenceDates(db);
  expect(occurrences[exerciseHabitId]).toBe('2023-01-17');

  updateOccurrence(db, { habitId: exerciseHabitId, date: '2023-01-17', updateData: { complete: false } });
  occurrences = getOldestVisibleOccurrenceDates(db);
  expect(occurrences[exerciseHabitId]).toBe('2023-01-17');
});

test('returns oldest occurrences for multiple habits', () => {
  const addOnlyHabitStmt = db.prepare('INSERT INTO habits (name, list_position) VALUES (?, ?)');
  const readHabitId = Number(addOnlyHabitStmt.run('read', 1).lastInsertRowid);
  const sleepHabitId = Number(addOnlyHabitStmt.run('sleep', 2).lastInsertRowid);

  addOccurrences(db, { habitIds: [exerciseHabitId], date: '2023-01-19' });
  addOccurrences(db, { habitIds: [readHabitId], date: '2023-01-17' });
  addOccurrences(db, { habitIds: [readHabitId], date: '2023-01-19' });

  const occurrences = getOldestVisibleOccurrenceDates(db);
  expect(occurrences).toEqual({
    [exerciseHabitId]: '2023-01-19',
    [readHabitId]: '2023-01-17',
    [sleepHabitId]: null,
  });
});

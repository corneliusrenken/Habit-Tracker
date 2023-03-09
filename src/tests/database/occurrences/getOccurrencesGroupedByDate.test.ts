import Database from 'better-sqlite3';
import {
  addDay,
  addHabit,
  addOccurrences,
  createTables,
  deleteHabit,
  getOccurrencesGroupedByDate,
  openDatabase,
} from '../../../api/database/functions';

let db: Database.Database;
let exerciseHabitId: number;
let readHabitId: number;

beforeEach(() => {
  db = openDatabase(':memory:');
  createTables(db);
  // can't use addHabit here as that automatically creates an occurrence for the day
  const addOnlyHabitStmt = db.prepare('INSERT INTO habits (name, list_position) VALUES (?, ?)');
  exerciseHabitId = Number(addOnlyHabitStmt.run('exercise', 0).lastInsertRowid);
  readHabitId = Number(addOnlyHabitStmt.run('read', 1).lastInsertRowid);
  addDay(db, { date: '2023-01-17' });
  addDay(db, { date: '2023-01-18' });
});

afterEach(() => {
  db.close();
});

test('returns an empty object if no day entries exist', () => {
  const deleteAllDaysStmt = db.prepare('DELETE FROM days');
  deleteAllDaysStmt.run();
  const occurrences = getOccurrencesGroupedByDate(db);
  expect(occurrences).toEqual({});
});

test('returns a single occurrence correctly', () => {
  addOccurrences(db, { habitIds: [exerciseHabitId], date: '2023-01-17' });

  const occurrences = getOccurrencesGroupedByDate(db);
  expect(occurrences).toEqual({
    '2023-01-17': {
      [exerciseHabitId]: {
        complete: false,
        visible: true,
      },
    },
    '2023-01-18': {},
  });
});

test('returns multiple occurrences on the same date correctly', () => {
  addOccurrences(db, { habitIds: [exerciseHabitId], date: '2023-01-17' });
  addOccurrences(db, { habitIds: [readHabitId], date: '2023-01-17' });

  const occurrences = getOccurrencesGroupedByDate(db);
  expect(occurrences).toEqual({
    '2023-01-17': {
      [exerciseHabitId]: {
        complete: false,
        visible: true,
      },
      [readHabitId]: {
        complete: false,
        visible: true,
      },
    },
    '2023-01-18': {},
  });
});

test('returns multiple occurrences on different dates correctly', () => {
  addOccurrences(db, { habitIds: [exerciseHabitId], date: '2023-01-17' });
  addOccurrences(db, { habitIds: [readHabitId], date: '2023-01-18' });

  const occurrences = getOccurrencesGroupedByDate(db);
  expect(occurrences).toEqual({
    '2023-01-17': {
      [exerciseHabitId]: {
        complete: false,
        visible: true,
      },
    },
    '2023-01-18': {
      [readHabitId]: {
        complete: false,
        visible: true,
      },
    },
  });
});

test('returns a date even if only the day entry exists, without any linked occurrences', () => {
  const occurrences = getOccurrencesGroupedByDate(db);
  expect(occurrences).toEqual({
    '2023-01-17': {},
    '2023-01-18': {},
  });
});

test('ignores occurrences whose habit got deleted', () => {
  let occurrences = getOccurrencesGroupedByDate(db);
  expect(occurrences).toEqual({
    '2023-01-17': {},
    '2023-01-18': {},
  });

  addOccurrences(db, { habitIds: [exerciseHabitId], date: '2023-01-17' });
  occurrences = getOccurrencesGroupedByDate(db);
  expect(occurrences).toEqual({
    '2023-01-17': { [exerciseHabitId]: { complete: false, visible: true } },
    '2023-01-18': {},
  });

  deleteHabit(db, { habitId: exerciseHabitId });
  occurrences = getOccurrencesGroupedByDate(db);
  expect(occurrences).toEqual({
    '2023-01-17': {},
    '2023-01-18': {},
  });
});

test('returns the correct result if an occurrence with null as habit_id exist before non-null habit_id occurrences', () => {
  addOccurrences(db, { habitIds: [exerciseHabitId], date: '2023-01-17' });
  addOccurrences(db, { habitIds: [readHabitId], date: '2023-01-17' });
  deleteHabit(db, { habitId: exerciseHabitId });

  const occurrences = getOccurrencesGroupedByDate(db);
  expect(occurrences).toEqual({
    '2023-01-17': { [readHabitId]: { complete: false, visible: true } },
    '2023-01-18': {},
  });
});

test('returns the correct result if an occurrence with null as habit_id exist after non-null habit_id occurrences', () => {
  addOccurrences(db, { habitIds: [exerciseHabitId], date: '2023-01-17' });
  addOccurrences(db, { habitIds: [readHabitId], date: '2023-01-17' });
  deleteHabit(db, { habitId: readHabitId });

  const occurrences = getOccurrencesGroupedByDate(db);
  expect(occurrences).toEqual({
    '2023-01-17': { [exerciseHabitId]: { complete: false, visible: true } },
    '2023-01-18': {},
  });
});

test('returns the correct result if multiple occurrences with null as habit_id exist before non-null habit_id occurrences', () => {
  addOccurrences(db, { habitIds: [exerciseHabitId], date: '2023-01-17' });
  addOccurrences(db, { habitIds: [readHabitId], date: '2023-01-17' });
  const sleepHabitId = addHabit(db, { name: 'sleep', date: '2023-01-17' }).id; // creates the occurrence as well
  deleteHabit(db, { habitId: exerciseHabitId });
  deleteHabit(db, { habitId: readHabitId });

  const occurrences = getOccurrencesGroupedByDate(db);
  expect(occurrences).toEqual({
    '2023-01-17': { [sleepHabitId]: { complete: false, visible: true } },
    '2023-01-18': {},
  });
});

test('returns the correct result if multiple occurrences with null as habit_id exist after non-null habit_id occurrences', () => {
  addOccurrences(db, { habitIds: [exerciseHabitId], date: '2023-01-17' });
  addOccurrences(db, { habitIds: [readHabitId], date: '2023-01-17' });
  const sleepHabitId = addHabit(db, { name: 'sleep', date: '2023-01-17' }).id; // creates the occurrence as well
  deleteHabit(db, { habitId: readHabitId });
  deleteHabit(db, { habitId: sleepHabitId });

  const occurrences = getOccurrencesGroupedByDate(db);
  expect(occurrences).toEqual({
    '2023-01-17': { [exerciseHabitId]: { complete: false, visible: true } },
    '2023-01-18': {},
  });
});

import Database from 'better-sqlite3';
import {
  addDay,
  addOccurrences,
  createTables,
  getOccurrencesGroupedByDate,
  openDatabase,
} from '../../queries';

let db: Database.Database;
let exerciseHabitId: number;
let readHabitId: number;

beforeEach(() => {
  db = openDatabase(':memory:');
  createTables(db);
  // can't use addHabit here as that automatically creates an occurrence for the day
  const addOnlyHabitStmt = db.prepare('INSERT INTO habits (name, order_in_list) VALUES (?, ?)');
  exerciseHabitId = Number(addOnlyHabitStmt.run('exercise', 0).lastInsertRowid);
  readHabitId = Number(addOnlyHabitStmt.run('read', 1).lastInsertRowid);
  addDay(db, '2023-01-17');
  addDay(db, '2023-01-18');
});

afterEach(() => {
  db.close();
});

test('returns an empty object if no occurrences exist', () => {
  const occurrences = getOccurrencesGroupedByDate(db);
  expect(occurrences).toEqual({});
});

test('returns a single occurrence correctly', () => {
  addOccurrences(db, [exerciseHabitId], '2023-01-17');

  const occurrences = getOccurrencesGroupedByDate(db);
  expect(occurrences).toEqual({
    '2023-01-17': {
      [exerciseHabitId]: {
        complete: false,
        visible: true,
      },
    },
  });
});

test('returns multiple occurrences on the same date correctly', () => {
  addOccurrences(db, [exerciseHabitId], '2023-01-17');
  addOccurrences(db, [readHabitId], '2023-01-17');

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
  });
});

test('returns multiple occurrences on the different dates correctly', () => {
  addOccurrences(db, [exerciseHabitId], '2023-01-17');
  addOccurrences(db, [readHabitId], '2023-01-18');

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

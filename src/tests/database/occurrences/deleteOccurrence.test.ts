import Database from 'better-sqlite3';
import {
  addDay,
  addHabit,
  addOccurrences,
  createTables,
  deleteOccurrence,
  getOccurrencesGroupedByDate,
  openDatabase,
} from '../../../database';

let db: Database.Database;
let exerciseHabitId: number;

beforeEach(() => {
  db = openDatabase(':memory:');
  createTables(db);
  addDay(db, '2023-01-19');
  // creates an occurrence on 2023-01-19
  exerciseHabitId = addHabit(db, 'exercise', '2023-01-19').id;
});

afterEach(() => {
  db.close();
});

test('throws an error if the occurrence to delete does not exist', () => {
  expect(() => deleteOccurrence(db, 1234, '2023-01-19')).toThrow('Error: No occurrence matches the given habit id / date');
  expect(() => deleteOccurrence(db, exerciseHabitId, '2023-01-20')).toThrow('Error: No occurrence matches the given habit id / date');
});

test('occurrence no longer exists in the database after being removed', () => {
  const getOccurrenceCountStmt = db.prepare('SELECT count(id) AS count FROM occurrences');
  expect(getOccurrenceCountStmt.get().count).toBe(1);
  deleteOccurrence(db, exerciseHabitId, '2023-01-19');
  expect(getOccurrenceCountStmt.get().count).toBe(0);
});

test('only deletes the occurrence matching the arguments', () => {
  addDay(db, '2023-01-17');
  addDay(db, '2023-01-18');
  addOccurrences(db, [exerciseHabitId], '2023-01-17');
  addOccurrences(db, [exerciseHabitId], '2023-01-18');

  deleteOccurrence(db, exerciseHabitId, '2023-01-18');

  const occurrences = getOccurrencesGroupedByDate(db);

  expect(occurrences).toEqual({
    '2023-01-17': { [exerciseHabitId]: { complete: false, visible: true } },
    '2023-01-18': {},
    '2023-01-19': { [exerciseHabitId]: { complete: false, visible: true } },
  });
});

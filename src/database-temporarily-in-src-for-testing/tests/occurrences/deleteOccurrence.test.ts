import Database from 'better-sqlite3';
import {
  addDay,
  addHabit,
  addOccurrences,
  createTables,
  deleteOccurrence,
  getOccurrencesGroupedByDate,
  openDatabase,
} from '../../queries';

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
  expect(() => deleteOccurrence(db, '2023-01-19', 1234)).toThrow('Error: No occurrence matches the given habit id / date');
  expect(() => deleteOccurrence(db, '2023-01-20', exerciseHabitId)).toThrow('Error: No occurrence matches the given habit id / date');
});

test('occurrence no longer exists in the database after being removed', () => {
  const getOccurrenceCountStmt = db.prepare('SELECT count(id) AS count FROM occurrences');
  expect(getOccurrenceCountStmt.get().count).toBe(1);
  deleteOccurrence(db, '2023-01-19', exerciseHabitId);
  expect(getOccurrenceCountStmt.get().count).toBe(0);
});

test('only deletes the occurrence matching the arguments', () => {
  addDay(db, '2023-01-17');
  addDay(db, '2023-01-18');
  addOccurrences(db, '2023-01-17', [exerciseHabitId]);
  addOccurrences(db, '2023-01-18', [exerciseHabitId]);

  deleteOccurrence(db, '2023-01-18', exerciseHabitId);

  const occurrences = getOccurrencesGroupedByDate(db);

  expect(occurrences).toHaveProperty('2023-01-17');
  expect(occurrences).not.toHaveProperty('2023-01-18');
  expect(occurrences).toHaveProperty('2023-01-19');
});

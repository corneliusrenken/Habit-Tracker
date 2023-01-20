import Database from 'better-sqlite3';
import { addOccurrences, createTables } from '../../queries';

let db: Database.Database;
let dayId: number;
let exerciseHabitId: number;
let readHabitId: number;
let sleepHabitId: number;

beforeEach(() => {
  db = new Database(':memory:');
  createTables(db);
  const addDayStmt = db.prepare('INSERT INTO days (date) VALUES (?)');
  dayId = Number(addDayStmt.run('2023-01-17').lastInsertRowid);
  // can't use addHabit as that function automatically creates an occurrence
  const addOnlyHabitStmt = db.prepare('INSERT INTO habits (name, order_in_list) VALUES (?, ?)');
  exerciseHabitId = Number(addOnlyHabitStmt.run('exercise', 0).lastInsertRowid);
  readHabitId = Number(addOnlyHabitStmt.run('read', 1).lastInsertRowid);
  sleepHabitId = Number(addOnlyHabitStmt.run('sleep', 2).lastInsertRowid);
});

afterEach(() => {
  db.close();
});

test('if the days table doesn\'t contain an entry with the date passed into the addOccurrence function, the function should throw an error', () => {
  expect(() => addOccurrences(db, '2023-01-16', [exerciseHabitId])).toThrow('NOT NULL constraint failed: occurrences.day_id');
});

test('trying to add an occurrence on a date where one for that habit already exists will throw an error', () => {
  addOccurrences(db, '2023-01-17', [exerciseHabitId]);
  expect(() => addOccurrences(db, '2023-01-17', [exerciseHabitId])).toThrow('UNIQUE constraint failed: occurrences.habit_id, occurrences.day_id');
});

test('if adding multiple occurrences, and one of them fails, none of the occurrences should be saved', () => {
  addOccurrences(db, '2023-01-17', [exerciseHabitId]);
  expect(() => addOccurrences(db, '2023-01-17', [exerciseHabitId, readHabitId])).toThrow();
  const getOccurrenceCountStmt = db.prepare('SELECT count(id) AS count FROM occurrences');
  const occurrenceCount = getOccurrenceCountStmt.get().count;
  expect(occurrenceCount).toBe(1);
});

test('added occurrences appear in the database correctly, with visibility and completeness set to their default values, 1 and 0, respectively', () => {
  const getOccurrencesStmt = db.prepare('SELECT visible, complete, habit_id, day_id FROM occurrences');
  addOccurrences(db, '2023-01-17', [exerciseHabitId]);
  let occurrences = getOccurrencesStmt.all();
  expect(occurrences.length).toBe(1);
  expect(occurrences[0].visible).toBe(1);
  expect(occurrences[0].complete).toBe(0);
  expect(occurrences[0].habit_id).toBe(exerciseHabitId);
  expect(occurrences[0].day_id).toBe(dayId);

  addOccurrences(db, '2023-01-17', [readHabitId, sleepHabitId]);
  occurrences = getOccurrencesStmt.all();
  expect(occurrences.length).toBe(3);

  const readOccurrence = occurrences.find(({ habit_id }) => habit_id === readHabitId);
  expect(readOccurrence.visible).toBe(1);
  expect(readOccurrence.complete).toBe(0);
  expect(readOccurrence.habit_id).toBe(readHabitId);
  expect(readOccurrence.day_id).toBe(dayId);

  const sleepOccurrence = occurrences.find(({ habit_id }) => habit_id === sleepHabitId);
  expect(sleepOccurrence.visible).toBe(1);
  expect(sleepOccurrence.complete).toBe(0);
  expect(sleepOccurrence.habit_id).toBe(sleepHabitId);
  expect(sleepOccurrence.day_id).toBe(dayId);
});

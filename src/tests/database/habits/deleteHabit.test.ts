import Database from 'better-sqlite3';
import {
  addHabit,
  createTables,
  deleteHabit,
  openDatabase,
} from '../../../database';

let db: Database.Database;
let exerciseHabitId: number;

beforeEach(() => {
  db = openDatabase(':memory:');
  createTables(db);
  const addDayStmt = db.prepare('INSERT INTO days (date) VALUES (?)');
  addDayStmt.run('2023-01-17');
  exerciseHabitId = addHabit(db, { name: 'exercise', date: '2023-01-17' }).id;
});

afterEach(() => {
  db.close();
});

test('throws an error if the habit to delete does not exist', () => {
  expect(() => deleteHabit(db, { habitId: 1234 })).toThrow('Error: No habit exists with this id');
});

test('habit no longer exists in the database after being removed', () => {
  const getHabitByNameStmt = db.prepare('SELECT id FROM habits WHERE id = ?');
  expect(getHabitByNameStmt.get(exerciseHabitId)).not.toBe(undefined);
  deleteHabit(db, { habitId: exerciseHabitId });
  expect(getHabitByNameStmt.get(exerciseHabitId)).toBe(undefined);
});

test('occurrences referencing the deleted habit should now reference null', () => {
  const getOccurrenceIdByHabitIdStmt = db.prepare('SELECT id FROM occurrences WHERE habit_id = ?');
  const occurrenceId = getOccurrenceIdByHabitIdStmt.get(exerciseHabitId).id;
  deleteHabit(db, { habitId: exerciseHabitId });
  const getOccurrenceHabitIdByIdStmt = db.prepare('SELECT habit_id FROM occurrences WHERE id = ?');
  const occurrenceHabitIdAfterDelete = getOccurrenceHabitIdByIdStmt.get(occurrenceId).habit_id;
  expect(occurrenceHabitIdAfterDelete).toBe(null);
});

describe('habit\'s list position values stay in an uninterrupted range from 0 -> habits length - 1 after a habit deletion, shifting down to close gaps', () => {
  let readHabitId: number;
  let sleepHabitId: number;
  let getHabitListPositionByIdStmt: Database.Statement;

  beforeEach(() => {
    readHabitId = addHabit(db, { name: 'read', date: '2023-01-17' }).id;
    sleepHabitId = addHabit(db, { name: 'sleep', date: '2023-01-17' }).id;
    getHabitListPositionByIdStmt = db.prepare('SELECT list_position FROM habits WHERE id = ?');
  });

  test('habit with the minimum list position is deleted', () => {
    deleteHabit(db, { habitId: exerciseHabitId });
    const readListPosition = getHabitListPositionByIdStmt.get(readHabitId).list_position;
    expect(readListPosition).toBe(0);
    const sleepListPosition = getHabitListPositionByIdStmt.get(sleepHabitId).list_position;
    expect(sleepListPosition).toBe(1);
  });

  test('habit with an list position in between max and min is deleted', () => {
    deleteHabit(db, { habitId: readHabitId });
    const exerciseListPosition = getHabitListPositionByIdStmt.get(exerciseHabitId).list_position;
    expect(exerciseListPosition).toBe(0);
    const sleepListPosition = getHabitListPositionByIdStmt.get(sleepHabitId).list_position;
    expect(sleepListPosition).toBe(1);
  });

  test('habit with the maximum list position is deleted', () => {
    deleteHabit(db, { habitId: sleepHabitId });
    const exerciseListPosition = getHabitListPositionByIdStmt.get(exerciseHabitId).list_position;
    expect(exerciseListPosition).toBe(0);
    const readListPosition = getHabitListPositionByIdStmt.get(readHabitId).list_position;
    expect(readListPosition).toBe(1);
  });
});

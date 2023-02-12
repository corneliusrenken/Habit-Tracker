import Database, { Statement } from 'better-sqlite3';
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
  exerciseHabitId = addHabit(db, 'exercise', '2023-01-17').id;
});

afterEach(() => {
  db.close();
});

test('throws an error if the habit to delete does not exist', () => {
  expect(() => deleteHabit(db, 1234)).toThrow('Error: No habit exists with this id');
});

test('habit no longer exists in the database after being removed', () => {
  const getHabitByNameStmt = db.prepare('SELECT id FROM habits WHERE id = ?');
  expect(getHabitByNameStmt.get(exerciseHabitId)).not.toBe(undefined);
  deleteHabit(db, exerciseHabitId);
  expect(getHabitByNameStmt.get(exerciseHabitId)).toBe(undefined);
});

test('occurrences referencing the deleted habit should now reference null', () => {
  const getOccurrenceIdByHabitIdStmt = db.prepare('SELECT id FROM occurrences WHERE habit_id = ?');
  const occurrenceId = getOccurrenceIdByHabitIdStmt.get(exerciseHabitId).id;
  deleteHabit(db, exerciseHabitId);
  const getOccurrenceHabitIdByIdStmt = db.prepare('SELECT habit_id FROM occurrences WHERE id = ?');
  const occurrenceHabitIdAfterDelete = getOccurrenceHabitIdByIdStmt.get(occurrenceId).habit_id;
  expect(occurrenceHabitIdAfterDelete).toBe(null);
});

describe('habit\'s order in list values stay in an uninterrupted range from 0 -> habits length - 1 after a habit deletion, shifting down to close gaps', () => {
  let readHabitId: number;
  let sleepHabitId: number;
  let getHabitOrderInListByIdStmt: Statement<any[]>; // eslint-disable-line @typescript-eslint/no-explicit-any, max-len

  beforeEach(() => {
    readHabitId = addHabit(db, 'read', '2023-01-17').id;
    sleepHabitId = addHabit(db, 'sleep', '2023-01-17').id;
    getHabitOrderInListByIdStmt = db.prepare('SELECT order_in_list FROM habits WHERE id = ?');
  });

  test('habit with the minimum order in list is deleted', () => {
    deleteHabit(db, exerciseHabitId);
    const readOrderInList = getHabitOrderInListByIdStmt.get(readHabitId).order_in_list;
    expect(readOrderInList).toBe(0);
    const sleepOrderInList = getHabitOrderInListByIdStmt.get(sleepHabitId).order_in_list;
    expect(sleepOrderInList).toBe(1);
  });

  test('habit with an order in list in between max and min is deleted', () => {
    deleteHabit(db, readHabitId);
    const exerciseOrderInList = getHabitOrderInListByIdStmt.get(exerciseHabitId).order_in_list;
    expect(exerciseOrderInList).toBe(0);
    const sleepOrderInList = getHabitOrderInListByIdStmt.get(sleepHabitId).order_in_list;
    expect(sleepOrderInList).toBe(1);
  });

  test('habit with the maximum order in list is deleted', () => {
    deleteHabit(db, sleepHabitId);
    const exerciseOrderInList = getHabitOrderInListByIdStmt.get(exerciseHabitId).order_in_list;
    expect(exerciseOrderInList).toBe(0);
    const readOrderInList = getHabitOrderInListByIdStmt.get(readHabitId).order_in_list;
    expect(readOrderInList).toBe(1);
  });
});

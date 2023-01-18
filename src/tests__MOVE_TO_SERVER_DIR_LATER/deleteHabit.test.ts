import Database, { Statement } from 'better-sqlite3';
import createTables from '../../server-sqlite/database/queries/createTables';
import addHabit from '../../server-sqlite/database/queries/habits/addHabit';
import deleteHabit from '../../server-sqlite/database/queries/habits/deleteHabit';

let db: Database.Database;
let exerciseHabitId: number;

beforeEach(() => {
  db = new Database(':memory:');
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

describe('habit\'s order indices stay in an uninterrupted range from 0 -> habits length - 1 after a habit deletion, shifting down to close gaps', () => {
  let readHabitId: number;
  let sleepHabitId: number;
  let getHabitOrderIndexByIdStmt: Statement<any[]>;

  beforeEach(() => {
    readHabitId = addHabit(db, 'read', '2023-01-17').id;
    sleepHabitId = addHabit(db, 'sleep', '2023-01-17').id;
    getHabitOrderIndexByIdStmt = db.prepare('SELECT order_index FROM habits WHERE id = ?');
  });

  test('habit with the minimum order index is deleted', () => {
    deleteHabit(db, exerciseHabitId);
    const readOrderIndex = getHabitOrderIndexByIdStmt.get(readHabitId).order_index;
    expect(readOrderIndex).toBe(0);
    const sleepOrderIndex = getHabitOrderIndexByIdStmt.get(sleepHabitId).order_index;
    expect(sleepOrderIndex).toBe(1);
  });

  test('habit with an order index in between max and min is deleted', () => {
    deleteHabit(db, readHabitId);
    const exerciseOrderIndex = getHabitOrderIndexByIdStmt.get(exerciseHabitId).order_index;
    expect(exerciseOrderIndex).toBe(0);
    const sleepOrderIndex = getHabitOrderIndexByIdStmt.get(sleepHabitId).order_index;
    expect(sleepOrderIndex).toBe(1);
  });

  test('habit with the maximum order index is deleted', () => {
    deleteHabit(db, sleepHabitId);
    const exerciseOrderIndex = getHabitOrderIndexByIdStmt.get(exerciseHabitId).order_index;
    expect(exerciseOrderIndex).toBe(0);
    const readOrderIndex = getHabitOrderIndexByIdStmt.get(readHabitId).order_index;
    expect(readOrderIndex).toBe(1);
  });
});

/* eslint-disable max-len */
import Database from 'better-sqlite3';
import {
  addDay,
  addHabit,
  createTables,
  openDatabase,
  updateOccurrence,
} from '../../../../../api/database/functions';

let db: Database.Database;
let exerciseHabitId: number;
let originalOccurrence: {
  visible: 1 | 0;
  complete: 1 | 0;
};
const occurrenceDate = '2023-01-19';

/**
 * @param date "YYYY-MM-DD"
 */
const getSingleOccurrence = (database: Database.Database, habitId: number, date: string) => {
  const getOccurrenceStmt = database.prepare(`
    SELECT visible, complete
    FROM occurrences
    LEFT JOIN days
    ON days.id = occurrences.day_id
    WHERE date = ? AND habit_id = ?
  `);

  const { visible, complete } = getOccurrenceStmt.get(date, habitId);

  return {
    visible,
    complete,
  };
};

beforeEach(() => {
  db = openDatabase(':memory:');
  createTables(db);
  addDay(db, { date: occurrenceDate });
  exerciseHabitId = addHabit(db, { name: 'exercise', date: occurrenceDate }).id;
  originalOccurrence = getSingleOccurrence(db, exerciseHabitId, occurrenceDate);
});

afterEach(() => {
  db.close();
});

test('verify occurrence starts with default values for next tests', () => {
  expect(originalOccurrence.visible).toBe(1);
  expect(originalOccurrence.complete).toBe(0);
});

test('doesn\'t throw when the changed value is the same as the original', () => {
  let update = () => updateOccurrence(db, { habitId: exerciseHabitId, date: occurrenceDate, updateData: { complete: false } });
  expect(update).not.toThrow();
  update = () => updateOccurrence(db, { habitId: exerciseHabitId, date: occurrenceDate, updateData: { visible: true } });
  expect(update).not.toThrow();
});

test('throws an error if the occurrence to update does not exist, even if the updated value is the same as the original', () => {
  expect(() => updateOccurrence(db, { habitId: exerciseHabitId, date: '2023-01-18', updateData: { complete: false } })).toThrow('Error: No occurrence matches the given habit id / date');
  expect(() => updateOccurrence(db, { habitId: exerciseHabitId, date: '2023-01-18', updateData: { visible: true } })).toThrow('Error: No occurrence matches the given habit id / date');
  expect(() => updateOccurrence(db, { habitId: 123, date: '2023-01-19', updateData: { complete: false } })).toThrow('Error: No occurrence matches the given habit id / date');
  expect(() => updateOccurrence(db, { habitId: 123, date: '2023-01-19', updateData: { visible: true } })).toThrow('Error: No occurrence matches the given habit id / date');
});

test('updates the occurrence\'s complete value, and only the complete value', () => {
  updateOccurrence(db, { habitId: exerciseHabitId, date: occurrenceDate, updateData: { complete: true } });
  const updatedOccurrence = getSingleOccurrence(db, exerciseHabitId, occurrenceDate);
  expect(updatedOccurrence.visible).toBe(originalOccurrence.visible);
  expect(updatedOccurrence.complete).toBe(1);
});

test('updates the occurrence\'s visibility value, and only the visibility value', () => {
  updateOccurrence(db, { habitId: exerciseHabitId, date: occurrenceDate, updateData: { visible: false } });
  const updatedOccurrence = getSingleOccurrence(db, exerciseHabitId, occurrenceDate);
  expect(updatedOccurrence.visible).toBe(0);
  expect(updatedOccurrence.complete).toBe(originalOccurrence.complete);
});

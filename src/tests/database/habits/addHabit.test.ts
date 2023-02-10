import Database from 'better-sqlite3';
import { addHabit, createTables, openDatabase } from '../../../database';

let db: Database.Database;

beforeEach(() => {
  db = openDatabase(':memory:');
  createTables(db);
});

afterEach(() => {
  db.close();
});

/**
 * @param date "YYYY-MM-DD"
 */
const addDay = (date: string) => {
  const addDayStmt = db.prepare('INSERT INTO days (date) VALUES (?)');
  return addDayStmt.run(date).lastInsertRowid;
};

test('if the days table doesn\'t contain an entry with the date passed into the addHabit function, the function should throw an error', () => {
  expect(() => addHabit(db, 'exercise', '2023-01-17')).toThrow('Error: No day entry exists with the passed date');
});

test('adding a habit with a pre-existing name will throw an error', () => {
  addDay('2023-01-17');
  expect(() => addHabit(db, 'exercise', '2023-01-17')).not.toThrow();
  expect(() => addHabit(db, 'exercise', '2023-01-17')).toThrow('UNIQUE constraint failed: habits.name');
});

test('added a habit with an invalid name will throw an error', () => {
  addDay('2023-01-17');
  expect(() => addHabit(db, '', '2023-01-17')).toThrow('CHECK constraint failed: name NOT IN (\'\')');
});

test('if either the adding of the occurrence or the habit fails, neither should be saved in the database', () => {
  const getHabitsStmt = db.prepare('SELECT id FROM habits');
  const getOccurrencesStmt = db.prepare('SELECT id FROM occurrences');

  expect(() => addHabit(db, '', '2023-01-17')).toThrow();
  expect(getHabitsStmt.all().length).toBe(0);
  expect(getOccurrencesStmt.all().length).toBe(0);

  addDay('2023-01-17');
  addHabit(db, 'exercise', '2023-01-17');
  expect(() => addHabit(db, 'exercise', '2023-01-17')).toThrow();
  expect(getHabitsStmt.all().length).toBe(1);
  expect(getOccurrencesStmt.all().length).toBe(1);
});

test('adding a habit creates a row in habits with the correct name', () => {
  addDay('2023-01-17');
  const habitName = 'exercise';
  addHabit(db, habitName, '2023-01-17');
  const getHabitsStmt = db.prepare('SELECT name FROM habits');
  const habits = getHabitsStmt.all();
  expect(habits.length).toBe(1);
  expect(habits[0].name).toBe(habitName);
});

test('adding a habit returns an object with data that matches the data in the database', () => {
  addDay('2023-01-17');
  const habit = addHabit(db, 'exercise', '2023-01-17');
  const getHabitsStmt = db.prepare('SELECT id, name, order_in_list FROM habits');
  const habitInDb = getHabitsStmt.get();
  expect(habit.id).toBe(habitInDb.id);
  expect(habit.name).toBe(habitInDb.name);
  expect(habit.orderInList).toBe(habitInDb.order_in_list);
});

test('a new habit will automatically get an order_in_list assigned, equal to how many habits existed before adding the new habit', () => {
  addDay('2023-01-17');
  const exerciseHabit = addHabit(db, 'exercise', '2023-01-17');
  const readHabit = addHabit(db, 'run', '2023-01-17');
  const sleepHabit = addHabit(db, 'sleep', '2023-01-17');
  expect(exerciseHabit.orderInList).toBe(0);
  expect(readHabit.orderInList).toBe(1);
  expect(sleepHabit.orderInList).toBe(2);
});

test('when adding a habit, a visible, but incomplete occurrence is created for that habit on the date that was passed into the addHabit function', () => {
  const date = '2023-01-17';

  const dayId = addDay(date);

  const habit = addHabit(db, 'exercise', date);

  const getOccurrencesStmt = db.prepare('SELECT id, visible, complete, habit_id, day_id FROM occurrences');
  const occurrences = getOccurrencesStmt.all();

  expect(occurrences.length).toBe(1);
  expect(occurrences[0].habit_id).toBe(habit.id);
  expect(occurrences[0].day_id).toBe(dayId);
  expect(occurrences[0].visible).toBe(1);
  expect(occurrences[0].complete).toBe(0);
});

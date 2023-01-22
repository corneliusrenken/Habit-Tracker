import Database from 'better-sqlite3';
import {
  openDatabase,
  createTables,
  initializeApp,
  addDay,
  addHabit,
  updateOccurrence,
} from '../../queries';

let db: Database.Database;
let exerciseHabitId: number;
let readHabitId: number;
let sleepHabitId: number;
let codeHabitId: number;

beforeEach(() => {
  db = openDatabase(':memory:');
  createTables(db);
  addDay(db, '2023-01-20');
  exerciseHabitId = addHabit(db, 'exercise', '2023-01-20').id;
  readHabitId = addHabit(db, 'read', '2023-01-20').id;
  sleepHabitId = addHabit(db, 'sleep', '2023-01-20').id;
  codeHabitId = addHabit(db, 'code', '2023-01-20').id;
  updateOccurrence(db, readHabitId, '2023-01-20', { complete: true });
  updateOccurrence(db, sleepHabitId, '2023-01-20', { complete: true });
  updateOccurrence(db, sleepHabitId, '2023-01-20', { visible: false });
  updateOccurrence(db, codeHabitId, '2023-01-20', { visible: false });
});

afterEach(() => {
  db.close();
});

test('returns habits, occurrences grouped by date, streaks, and oldest visible occurrence dates', () => {
  const initializeAppResult = initializeApp(db, '2023-01-21');
  expect(initializeAppResult).toHaveProperty('habits');
  expect(initializeAppResult).toHaveProperty('occurrencesGroupedByDate');
  expect(initializeAppResult).toHaveProperty('streaks');
  expect(initializeAppResult).toHaveProperty('oldestVisibleOccurrenceDates');
});

describe('if the date passed into the function doesn\'t already have a corresponding day entry...', () => {
  test('a day entry is created linked to the passed date', () => {
    const selectDayByDateStmt = db.prepare('SELECT id FROM days WHERE date = ?');
    expect(selectDayByDateStmt.get('2023-01-21')).toBe(undefined);
    initializeApp(db, '2023-01-21');
    expect(selectDayByDateStmt.get('2023-01-21')).not.toBe(undefined);
  });

  test('incomplete, visible, occurrences are created on the passed date for all habits that were visible on the last registered day entry', () => {
    initializeApp(db, '2023-01-21');
    const getOccurrenceByHabitIdAndDateStmt = db.prepare(`
      SELECT occurrences.id, complete, visible
      FROM occurrences
      LEFT JOIN days
      ON occurrences.day_id = days.id
      WHERE habit_id = ? AND date = ?
    `);

    const exerciseOccurrence = getOccurrenceByHabitIdAndDateStmt.get(exerciseHabitId, '2023-01-21');
    const readOccurrence = getOccurrenceByHabitIdAndDateStmt.get(readHabitId, '2023-01-21');
    const sleepOccurrence = getOccurrenceByHabitIdAndDateStmt.get(sleepHabitId, '2023-01-21');
    const codeOccurrence = getOccurrenceByHabitIdAndDateStmt.get(codeHabitId, '2023-01-21');

    expect(exerciseOccurrence).not.toBe(undefined);
    expect(readOccurrence).not.toBe(undefined);
    expect(sleepOccurrence).toBe(undefined);
    expect(codeOccurrence).toBe(undefined);

    expect(exerciseOccurrence.visible).toBe(1);
    expect(exerciseOccurrence.complete).toBe(0);
    expect(readOccurrence.visible).toBe(1);
    expect(readOccurrence.complete).toBe(0);
  });

  test('if no day entry exists prior to the passed one, no error is thrown, and no occurrences have to be created as no prior occurrences can exist', () => {
    const getOccurrencesBeforeDateStmt = db.prepare(`
      SELECT occurrences.id
      FROM occurrences
      LEFT JOIN days
      ON occurrences.day_id = days.id
      WHERE date <= ?
    `);
    initializeApp(db, '2023-01-19');
    expect(getOccurrencesBeforeDateStmt.all('2023-01-19').length).toBe(0);
  });

  test('data is fetched, including the occurrences created for the current date', () => {
    const initializeAppResult = initializeApp(db, '2023-01-21');
    expect(initializeAppResult).toEqual({
      habits: [
        { id: 1, name: 'exercise', orderInList: 0 },
        { id: 2, name: 'read', orderInList: 1 },
        { id: 3, name: 'sleep', orderInList: 2 },
        { id: 4, name: 'code', orderInList: 3 },
      ],
      occurrencesGroupedByDate: {
        '2023-01-20': {
          1: { visible: true, complete: false },
          2: { visible: true, complete: true },
          3: { visible: false, complete: true },
          4: { visible: false, complete: false },
        },
        '2023-01-21': {
          1: { visible: true, complete: false },
          2: { visible: true, complete: false },
        },
      },
      streaks: {
        1: { current: 0, maximum: 0 },
        2: { current: 1, maximum: 1 },
        3: { current: 0, maximum: 0 },
        4: { current: 0, maximum: 0 },
      },
      oldestVisibleOccurrenceDates: {
        1: '2023-01-20',
        2: '2023-01-20',
        3: null,
        4: null,
      },
    });
  });
});

describe('if the date passed into the function already has a corresponding day entry...', () => {
  test('the app was already initialized so only the data has to be fetched', () => {
    const initializeAppResult = initializeApp(db, '2023-01-20');
    expect(initializeAppResult).toEqual({
      habits: [
        { id: 1, name: 'exercise', orderInList: 0 },
        { id: 2, name: 'read', orderInList: 1 },
        { id: 3, name: 'sleep', orderInList: 2 },
        { id: 4, name: 'code', orderInList: 3 },
      ],
      occurrencesGroupedByDate: {
        '2023-01-20': {
          1: { visible: true, complete: false },
          2: { visible: true, complete: true },
          3: { visible: false, complete: true },
          4: { visible: false, complete: false },
        },
      },
      streaks: {
        1: { current: 0, maximum: 0 },
        2: { current: 1, maximum: 1 },
        3: { current: 0, maximum: 0 },
        4: { current: 0, maximum: 0 },
      },
      oldestVisibleOccurrenceDates: {
        1: '2023-01-20',
        2: '2023-01-20',
        3: null,
        4: null,
      },
    });
  });
});

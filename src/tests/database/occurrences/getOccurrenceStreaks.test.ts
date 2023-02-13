import Database from 'better-sqlite3';
import {
  addDay,
  addOccurrences,
  createTables,
  getOccurrenceStreaks,
  openDatabase,
  updateOccurrence,
} from '../../../database';

let db: Database.Database;
let exerciseHabitId: number;

beforeEach(() => {
  db = openDatabase(':memory:');
  createTables(db);
  // can't use addHabit here as that automatically creates an occurrence for the day
  const addOnlyHabitStmt = db.prepare('INSERT INTO habits (name, list_position) VALUES (?, ?)');
  exerciseHabitId = Number(addOnlyHabitStmt.run('exercise', 0).lastInsertRowid);
  addDay(db, '2023-01-01');
  addDay(db, '2023-01-02');
  addDay(db, '2023-01-03');
  addDay(db, '2023-01-17');
  addDay(db, '2023-01-18');
  addDay(db, '2023-01-19');
});

afterEach(() => {
  db.close();
});

test('returns an empty object if no habits exist', () => {
  const deleteAllHabitsStmt = db.prepare('DELETE FROM habits');
  deleteAllHabitsStmt.run();
  expect(getOccurrenceStreaks(db, '2023-01-19')).toEqual({});
});

test('ignores occurrences that happened after the passed date', () => {
  addDay(db, '2024-01-19');
  addOccurrences(db, [exerciseHabitId], '2024-01-19');
  updateOccurrence(db, exerciseHabitId, '2024-01-19', { complete: true });

  let occurrences = getOccurrenceStreaks(db, '2023-01-19');
  expect(occurrences[exerciseHabitId].maximum).toBe(0);
  expect(occurrences[exerciseHabitId].current).toBe(0);

  occurrences = getOccurrenceStreaks(db, '2024-01-18');
  expect(occurrences[exerciseHabitId].maximum).toBe(0);
  expect(occurrences[exerciseHabitId].current).toBe(0);

  occurrences = getOccurrenceStreaks(db, '2024-01-19');
  expect(occurrences[exerciseHabitId].maximum).toBe(1);
  expect(occurrences[exerciseHabitId].current).toBe(1);
});

test('ignores occurrences that are not visible', () => {
  addOccurrences(db, [exerciseHabitId], '2023-01-19');
  updateOccurrence(db, exerciseHabitId, '2023-01-19', { complete: true });

  let occurrences = getOccurrenceStreaks(db, '2023-01-19');
  expect(occurrences[exerciseHabitId].maximum).toBe(1);
  expect(occurrences[exerciseHabitId].current).toBe(1);

  updateOccurrence(db, exerciseHabitId, '2023-01-19', { visible: false });

  occurrences = getOccurrenceStreaks(db, '2023-01-19');
  expect(occurrences[exerciseHabitId].maximum).toBe(0);
  expect(occurrences[exerciseHabitId].current).toBe(0);
});

describe('maximum streak', () => {
  test('returns a maximum streak of 0 if no occurrences exist for the habit', () => {
    const occurrences = getOccurrenceStreaks(db, '2023-01-19');
    expect(occurrences[exerciseHabitId].maximum).toBe(0);
  });

  test('ignores incomplete occurrences when calculating maximum streak', () => {
    addOccurrences(db, [exerciseHabitId], '2023-01-19');
    const occurrences = getOccurrenceStreaks(db, '2023-01-19');
    expect(occurrences[exerciseHabitId].maximum).toBe(0);
  });

  test('returns the correct maximum streak if it\'s the current streak', () => {
    addOccurrences(db, [exerciseHabitId], '2023-01-18');
    updateOccurrence(db, exerciseHabitId, '2023-01-18', { complete: true });
    let occurrences = getOccurrenceStreaks(db, '2023-01-19');
    expect(occurrences[exerciseHabitId].maximum).toBe(1);

    addOccurrences(db, [exerciseHabitId], '2023-01-19');
    updateOccurrence(db, exerciseHabitId, '2023-01-19', { complete: true });
    occurrences = getOccurrenceStreaks(db, '2023-01-19');
    expect(occurrences[exerciseHabitId].maximum).toBe(2);
  });

  test('returns the correct maximum streak when a shorter one occurred previously', () => {
    addOccurrences(db, [exerciseHabitId], '2023-01-01');
    addOccurrences(db, [exerciseHabitId], '2023-01-02');

    addOccurrences(db, [exerciseHabitId], '2023-01-17');
    addOccurrences(db, [exerciseHabitId], '2023-01-18');
    addOccurrences(db, [exerciseHabitId], '2023-01-19');

    updateOccurrence(db, exerciseHabitId, '2023-01-01', { complete: true });
    updateOccurrence(db, exerciseHabitId, '2023-01-02', { complete: true });

    updateOccurrence(db, exerciseHabitId, '2023-01-17', { complete: true });
    updateOccurrence(db, exerciseHabitId, '2023-01-18', { complete: true });
    updateOccurrence(db, exerciseHabitId, '2023-01-19', { complete: true });

    const occurrences = getOccurrenceStreaks(db, '2023-01-19');
    expect(occurrences[exerciseHabitId].maximum).toBe(3);
  });

  test('returns the correct maximum streak when a shorter one occurred after', () => {
    addOccurrences(db, [exerciseHabitId], '2023-01-01');
    addOccurrences(db, [exerciseHabitId], '2023-01-02');
    addOccurrences(db, [exerciseHabitId], '2023-01-03');

    addOccurrences(db, [exerciseHabitId], '2023-01-18');
    addOccurrences(db, [exerciseHabitId], '2023-01-19');

    updateOccurrence(db, exerciseHabitId, '2023-01-01', { complete: true });
    updateOccurrence(db, exerciseHabitId, '2023-01-02', { complete: true });
    updateOccurrence(db, exerciseHabitId, '2023-01-03', { complete: true });

    updateOccurrence(db, exerciseHabitId, '2023-01-18', { complete: true });
    updateOccurrence(db, exerciseHabitId, '2023-01-19', { complete: true });

    const occurrences = getOccurrenceStreaks(db, '2023-01-19');
    expect(occurrences[exerciseHabitId].maximum).toBe(3);
  });
});

describe('current streak', () => {
  test('returns a current streak of 0 if no occurrences exist for the habit', () => {
    const occurrences = getOccurrenceStreaks(db, '2023-01-19');
    expect(occurrences[exerciseHabitId].current).toBe(0);
  });

  test('a current streak can end on the day before the passed date, as it\'s still possible to continue the streak', () => {
    addOccurrences(db, [exerciseHabitId], '2023-01-18');
    updateOccurrence(db, exerciseHabitId, '2023-01-18', { complete: true });
    const occurrences = getOccurrenceStreaks(db, '2023-01-19');
    expect(occurrences[exerciseHabitId].current).toBe(1);
  });

  test('a current streak can end on the passed date', () => {
    addOccurrences(db, [exerciseHabitId], '2023-01-19');
    updateOccurrence(db, exerciseHabitId, '2023-01-19', { complete: true });
    const occurrences = getOccurrenceStreaks(db, '2023-01-19');
    expect(occurrences[exerciseHabitId].current).toBe(1);
  });

  test('ignores streaks that did not end on or 1 day before the passed date', () => {
    addOccurrences(db, [exerciseHabitId], '2023-01-17');
    updateOccurrence(db, exerciseHabitId, '2023-01-17', { complete: true });
    const occurrences = getOccurrenceStreaks(db, '2023-01-19');
    expect(occurrences[exerciseHabitId].current).toBe(0);
  });

  test('ignores incomplete occurrences when calculating current streak', () => {
    addOccurrences(db, [exerciseHabitId], '2023-01-17');
    addOccurrences(db, [exerciseHabitId], '2023-01-18');
    addOccurrences(db, [exerciseHabitId], '2023-01-19');
    let occurrences = getOccurrenceStreaks(db, '2023-01-19');
    expect(occurrences[exerciseHabitId].current).toBe(0);

    updateOccurrence(db, exerciseHabitId, '2023-01-17', { complete: true });
    occurrences = getOccurrenceStreaks(db, '2023-01-19');
    expect(occurrences[exerciseHabitId].current).toBe(0);

    updateOccurrence(db, exerciseHabitId, '2023-01-18', { complete: true });
    occurrences = getOccurrenceStreaks(db, '2023-01-19');
    expect(occurrences[exerciseHabitId].current).toBe(2);

    updateOccurrence(db, exerciseHabitId, '2023-01-19', { complete: true });
    occurrences = getOccurrenceStreaks(db, '2023-01-19');
    expect(occurrences[exerciseHabitId].current).toBe(3);
  });
});

test('produces the correct data when getting streaks for 2 habits', () => {
  const addOnlyHabitStmt = db.prepare('INSERT INTO habits (name, list_position) VALUES (?, ?)');
  const readHabitId = Number(addOnlyHabitStmt.run('read', 1).lastInsertRowid);
  const sleepHabitId = Number(addOnlyHabitStmt.run('sleep', 2).lastInsertRowid);

  addOccurrences(db, [exerciseHabitId], '2023-01-01');
  updateOccurrence(db, exerciseHabitId, '2023-01-01', { complete: true });
  addOccurrences(db, [exerciseHabitId], '2023-01-02');
  updateOccurrence(db, exerciseHabitId, '2023-01-02', { complete: true });
  addOccurrences(db, [exerciseHabitId], '2023-01-03');
  updateOccurrence(db, exerciseHabitId, '2023-01-03', { complete: true });
  addOccurrences(db, [exerciseHabitId], '2023-01-18');
  updateOccurrence(db, exerciseHabitId, '2023-01-18', { complete: true });
  addOccurrences(db, [exerciseHabitId], '2023-01-19');
  updateOccurrence(db, exerciseHabitId, '2023-01-19', { complete: true });

  addDay(db, '2022-01-31');
  addDay(db, '2022-02-01');
  addOccurrences(db, [readHabitId], '2022-01-31');
  updateOccurrence(db, readHabitId, '2022-01-31', { complete: true });
  addOccurrences(db, [readHabitId], '2022-02-01');
  updateOccurrence(db, readHabitId, '2022-02-01', { complete: true });

  const occurrences = getOccurrenceStreaks(db, '2023-01-19');
  expect(occurrences).toEqual({
    [exerciseHabitId]: {
      current: 2,
      maximum: 3,
    },
    [readHabitId]: {
      current: 0,
      maximum: 2,
    },
    [sleepHabitId]: {
      current: 0,
      maximum: 0,
    },
  });
});

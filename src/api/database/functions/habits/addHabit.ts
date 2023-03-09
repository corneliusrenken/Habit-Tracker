import { Database } from 'better-sqlite3';

/**
 * @param date "YYYY-MM-DD"
 */
export default function addHabit(database: Database, options: { name: string, date: string }): {
  id: number;
  name: string;
} {
  const { name, date } = options;

  const getDayStmt = database.prepare('SELECT id FROM days WHERE date = ?');
  const day = getDayStmt.get(date);
  if (day === undefined) {
    throw new Error('Error: No day entry exists with the passed date');
  }

  const addHabitStmt = database.prepare(`
    INSERT INTO habits (name, list_position)
    VALUES
      (?, (SELECT count(id) FROM habits))
    RETURNING id, name
  `);

  const addOccurrenceStmt = database.prepare(`
    INSERT INTO occurrences (habit_id, day_id)
    VALUES
      (?, ?)
  `);

  const addHabitAndOccurrenceTransaction = database.transaction(() => {
    const habit = addHabitStmt.get(name);
    addOccurrenceStmt.run(habit.id, day.id);
    return habit;
  });

  const addedHabit = addHabitAndOccurrenceTransaction();

  return addedHabit;
}

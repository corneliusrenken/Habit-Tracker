import { Database } from 'better-sqlite3';

/**
 * @param date "YYYY-MM-DD"
 */
export default function addHabit(database: Database, name: string, date: string): {
  id: number;
  name: string;
  order_in_list: number;
} {
  const getDayStmt = database.prepare('SELECT id FROM days WHERE date = ?');
  const day = getDayStmt.get(date);
  if (day === undefined) {
    throw new Error('Error: No day entry exists with the passed date');
  }

  const addHabitStmt = database.prepare(`
    INSERT INTO habits (name, order_in_list)
    VALUES
      (?, (SELECT count(id) FROM habits))
    RETURNING id, name, order_in_list
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

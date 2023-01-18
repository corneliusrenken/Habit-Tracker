import { Database } from 'better-sqlite3';

export default function createTables(database: Database) {
  // order_index can only be null to allow for order_index swapping or reorganizing
  // when swapping, can use pragma to skip check
  const createHabitsTableStmt = database.prepare(`
    CREATE TABLE IF NOT EXISTS habits (
      id INTEGER PRIMARY KEY,
      name TEXT UNIQUE NOT NULL CHECK (name NOT IN ('')),
      order_index INTEGER UNIQUE CHECK (order_index IS NOT NULL)
    )
  `);

  const createDaysTableStmt = database.prepare(`
    CREATE TABLE IF NOT EXISTS days (
      id INTEGER PRIMARY KEY,
      date TEXT UNIQUE NOT NULL CHECK (date IS strftime('%Y-%m-%d', date))
    )
  `);

  const createOccurrencesTableStmt = database.prepare(`
    CREATE TABLE IF NOT EXISTS occurrences (
      id INTEGER PRIMARY KEY,
      visible INTEGER NOT NULL CHECK (visible IN (0, 1)) DEFAULT 1,
      complete INTEGER NOT NULL CHECK (complete IN (0, 1)) DEFAULT 0,
      habit_id INTEGER,
      day_id INTEGER NOT NULL,
      UNIQUE (habit_id, day_id),
      FOREIGN KEY (habit_id) REFERENCES habits (id) ON DELETE SET NULL,
      FOREIGN KEY (day_id) REFERENCES days (id) ON DELETE CASCADE
    )
  `);

  createHabitsTableStmt.run();
  createDaysTableStmt.run();
  createOccurrencesTableStmt.run();
}

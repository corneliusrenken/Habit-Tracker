import { Database } from 'better-sqlite3';

export default function setUniqueIndexOnListPosition(database: Database) {
  const setUniqueIndexOnListPositionStmt = database.prepare(`
    CREATE UNIQUE INDEX IF NOT EXISTS ux_habits_list_position ON habits(list_position)
  `);
  setUniqueIndexOnListPositionStmt.run();
}

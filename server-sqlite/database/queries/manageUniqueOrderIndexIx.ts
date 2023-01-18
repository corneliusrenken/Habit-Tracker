import { Database } from 'better-sqlite3';

export function setUniqueOrderIndexIx(database: Database) {
  const createUniqueOrderIndexStmt = database.prepare(`
    CREATE UNIQUE INDEX IF NOT EXISTS ux_habits_order_index ON habits(order_index)
  `);
  createUniqueOrderIndexStmt.run();
}

export function dropUniqueOrderIndexIx(database: Database) {
  const dropUniqueOrderIndexStmt = database.prepare('DROP INDEX ux_habits_order_index');
  dropUniqueOrderIndexStmt.run();
}

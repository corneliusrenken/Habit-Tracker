import { Database } from 'better-sqlite3';

export default function dropUniqueOrderInListIndex(database: Database) {
  const dropUniqueOrderInListIndexStmt = database.prepare('DROP INDEX ux_habits_order_in_list');
  dropUniqueOrderInListIndexStmt.run();
}

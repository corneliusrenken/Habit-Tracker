import { Database } from 'better-sqlite3';

export default function dropUniqueIndexOnListPosition(database: Database) {
  const dropUniqueIndexOnListPositionStmt = database.prepare('DROP INDEX ux_habits_list_position');
  dropUniqueIndexOnListPositionStmt.run();
}

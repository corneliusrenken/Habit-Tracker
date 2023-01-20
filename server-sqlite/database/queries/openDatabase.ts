import Database from 'better-sqlite3';

export default function openDatabase(filepath: string) {
  const database = new Database(filepath);
  database.pragma('journal_mode = WAL');
  database.pragma('foreign_keys = ON');
  return database;
}

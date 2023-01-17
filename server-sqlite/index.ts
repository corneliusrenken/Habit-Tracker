import express from 'express';
import Database from 'better-sqlite3';
import { join } from 'path';
import createTables from './database/queries/createTables';

const app = express();

app.use(express.json());

const dbFilePath = join(__dirname, 'dev-testing.db');

const db = new Database(dbFilePath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

createTables(db);

app.get('/', (req, res) => {
  res.send('server online!');
});

app.listen(7777, () => console.log(`http://localhost:${7777}`)); // eslint-disable-line no-console

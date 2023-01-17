import express from 'express';
import Database from 'better-sqlite3';
import { join } from 'path';

const app = express();

app.use(express.json());

const dbFilePath = join(__dirname, 'dev-testing.db');

const db = new Database(dbFilePath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

const createTable = db.prepare(`
  CREATE TABLE IF NOT EXISTS names (
    id INTEGER PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
  );
`);

createTable.run();

app.get('/', (req, res) => {
  res.send('server online!');
});

app.post('/:name', (req, res) => {
  const { name } = req.params;

  const addName = db.prepare('INSERT INTO names (name) VALUES (?)');

  try {
    const { lastInsertRowid } = addName.run(name);
    console.log('inserted row:', lastInsertRowid);
    res.status(201).send('added name!');
  } catch {
    res.status(500).send('failed to add name :(');
  }
});

app.listen(7777, () => console.log(`http://localhost:${7777}`)); // eslint-disable-line no-console

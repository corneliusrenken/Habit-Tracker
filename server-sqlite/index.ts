import express from 'express';
import { join } from 'path';
import createTables from './database/queries/createTables';
import openDatabase from './database/queries/openDatabase';

const app = express();

app.use(express.json());

const dbFilePath = join(__dirname, 'dev-testing.db');

const database = openDatabase(dbFilePath);

createTables(database);

app.get('/', (req, res) => {
  res.send('server online!');
});

app.listen(7777, () => console.log(`http://localhost:${7777}`)); // eslint-disable-line no-console

/* eslint-disable no-console */
import express from 'express';
import { commonRouter, habitsRouter, occurrencesRouter } from './routes';

const app = express();

app.use(express.json());

app.use('/api/habits', habitsRouter);
app.use('/api/occurrences', occurrencesRouter);
app.use('/api', commonRouter);

app.listen(7777, () => console.log(`http://localhost:${7777}`));

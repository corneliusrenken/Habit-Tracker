/* eslint-disable no-console */
import express from 'express';
import habitRouter from './routes/habits';

const app = express();

app.use(express.json());

app.use('/api/habits', habitRouter);

app.listen(7777, () => console.log(`http://localhost:${7777}`));

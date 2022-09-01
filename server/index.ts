/* eslint-disable no-console */
import express from 'express';
import router from './routes';

const app = express();

app.use(express.json());

app.use('/api', router);

app.listen(7777, () => console.log(`http://localhost:${7777}`));

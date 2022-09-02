import express from 'express';
import { addCompletedDay, deleteCompletedDay } from '../db/models/completedDays';
import { getHabits } from '../db/models/habits';
import { addOccurrence, deleteOccurrence, getOccurrences } from '../db/models/occurrences';

const router = express.Router();

router.get('/habits/:userId', async (req, res) => {
  try {
    const habits = await getHabits(Number(req.params.userId));
    res.status(200).json(habits);
  } catch (err) {
    res.status(500).send(`${err}`);
  }
});

router.get('/occurrences/:userId/:date', async (req, res) => {
  try {
    const occurrences = await getOccurrences(Number(req.params.userId), `${req.params.date}T00:00:00Z`);
    res.status(200).json(occurrences);
  } catch (err) {
    res.status(500).send(`${err}`);
  }
});

router.post('/occurrences', async (req, res) => {
  try {
    const { habitId, date } = req.body;
    await addOccurrence(habitId, `${date}T00:00:00Z`);
    res.status(201).end();
  } catch (err) {
    res.status(500).send(`${err}`);
  }
});

router.delete('/occurrences', async (req, res) => {
  try {
    const { habitId, date } = req.body;
    await deleteOccurrence(habitId, `${date}T00:00:00Z`);
    res.status(200).end();
  } catch (err) {
    res.status(500).send(`${err}`);
  }
});

router.post('/completed-days', async (req, res) => {
  try {
    const { userId, date } = req.body;
    await addCompletedDay(userId, `${date}T00:00:00Z`);
    res.status(201).end();
  } catch (err) {
    res.status(500).send(`${err}`);
  }
});

router.delete('/completed-days', async (req, res) => {
  try {
    const { userId, date } = req.body;
    await deleteCompletedDay(userId, `${date}T00:00:00Z`);
    res.status(200).end();
  } catch (err) {
    res.status(500).send(`${err}`);
  }
});

export default router;

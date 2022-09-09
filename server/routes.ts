import express from 'express';
import { addCompletedDay, deleteCompletedDay, getCompletedDays } from '../db/models/completedDays';
import { getHabits } from '../db/models/habits';
import {
  addOccurrence, deleteOccurrence, getOccurrences, getOccurrenceStreaks,
} from '../db/models/occurrences';

const router = express.Router();

router.get('/habits/:userId', async (req, res) => {
  try {
    const habits = await getHabits(Number(req.params.userId));
    res.status(200).json(habits);
  } catch (err) {
    res.status(500).send(`${err}`);
  }
});

router.get('/occurrences/streaks/:userId/', async (req, res) => {
  const today = req.query.today ? `${req.query.today}` : undefined;
  if (!today) {
    res.status(400).end();
    return;
  }
  try {
    const streaks = await getOccurrenceStreaks(Number(req.params.userId), today);
    res.status(200).json(streaks[0].streaks);
  } catch (err) {
    res.status(500).send(`${err}`);
  }
});

router.get('/occurrences/:userId', async (req, res) => {
  try {
    const from = req.query.from ? `${req.query.from}` : undefined;
    const until = req.query.until ? `${req.query.until}` : undefined;
    const occurrences = await getOccurrences(Number(req.params.userId), from, until);
    res.status(200).json(occurrences[0]);
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

router.get('/completed-days/:userId', async (req, res) => {
  try {
    const completedDays = await getCompletedDays(Number(req.params.userId));
    res.status(201).json(completedDays[0]);
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

import { Router } from 'express';
import {
  addOccurrences,
  getOccurrencesByDate,
  getOccurrenceStreaks,
  getOldestTrueOccurrences,
  removeOccurrence,
  updateOccurrence,
} from '../queries/occurrences';

const router = Router();

router.get('/users/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const occurrences = await getOccurrencesByDate(Number(userId));

    res.status(200).json(occurrences);
  } catch (error) {
    res.status(500).end();
  }
});

router.get('/streaks/:dateString/users/:userId', async (req, res) => {
  const { userId, dateString } = req.params;

  try {
    const occurrenceStreaks = await getOccurrenceStreaks(Number(userId), dateString);

    res.status(200).json(occurrenceStreaks);
  } catch (error) {
    res.status(500).end();
  }
});

router.get('/oldest/users/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const oldestOccurrences = await getOldestTrueOccurrences(Number(userId));

    res.status(200).json(oldestOccurrences);
  } catch (error) {
    res.status(500).end();
  }
});

router.post('/', async (req, res) => {
  const { occurrences } = req.body;

  try {
    await addOccurrences(occurrences);

    res.status(204).end();
  } catch (error) {
    res.status(500).end();
  }
});

router.delete('/:habitId/:dateString', async (req, res) => {
  const { habitId, dateString } = req.params;

  try {
    await removeOccurrence(Number(habitId), dateString);

    res.status(204).end();
  } catch (error) {
    res.status(500).end();
  }
});

router.delete('/:habitId/:dateString', async (req, res) => {
  const { habitId, dateString } = req.params;

  try {
    await removeOccurrence(Number(habitId), dateString);

    res.status(204).end();
  } catch (error) {
    res.status(500).end();
  }
});

router.patch('/:habitId/:dateString', async (req, res) => {
  const { habitId, dateString } = req.params;
  const { completed } = req.body;

  try {
    await updateOccurrence(Number(habitId), dateString, completed);

    res.status(204).end();
  } catch (error) {
    res.status(500).end();
  }
});

export default router;

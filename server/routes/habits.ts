import { Router } from 'express';
import {
  addHabit, getAllHabits, removeHabit, updateHabit,
} from '../queries/habits';

const router = Router();

router.get('/users/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const habits = await getAllHabits(Number(userId));

    res.status(200).json(habits);
  } catch (error) {
    res.status(500).end();
  }
});

router.post('/', async (req, res) => {
  const { userId, name, dateString } = req.body;

  try {
    const createdHabit = await addHabit(userId, name, dateString);

    res.status(201).json(createdHabit);
  } catch (error) {
    res.status(500).end();
  }
});

router.delete('/:habitId', async (req, res) => {
  const { habitId } = req.params;

  try {
    await removeHabit(Number(habitId));

    res.status(204).end();
  } catch (error) {
    res.status(500).end();
  }
});

router.patch('/:habitId', async (req, res) => {
  const { habitId } = req.params;
  const { name, order } = req.body;

  const updateInfo = {
    name,
    order,
  };

  try {
    const updatedHabit = await updateHabit(Number(habitId), updateInfo);

    res.status(200).json(updatedHabit);
  } catch (error) {
    res.status(500).end();
  }
});

export default router;

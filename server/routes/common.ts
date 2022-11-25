import { Router } from 'express';
import initializeApp from '../queries/common/initializeApp';

const router = Router();

router.get('/users/:userId/initialize/:dateString', async (req, res) => {
  const { userId, dateString } = req.params;

  try {
    const initializeData = await initializeApp(Number(userId), dateString);

    res.status(200).json(initializeData);
  } catch (error) {
    res.status(500).end();
  }
});

export default router;

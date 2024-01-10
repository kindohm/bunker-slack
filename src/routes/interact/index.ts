import express from 'express';
import { Request, Response } from 'express';

const router = express.Router();

router.post('/', (req: Request, res: Response) => {
  console.log('interact', JSON.stringify(req.body.payload, null, 2));
  const { body } = req;

  console.log('full body', body);

  return res.json({ message: 'ok' });
});

export default router;

import express from 'express';
import { Request, Response } from 'express';
import { sendDelayedResponse } from '../../delayedResponse';

const router = express.Router();

router.post('/', (req: Request, res: Response) => {
  console.log('/talker');
  const { body } = req;
  const { challenge } = body;

  console.log('talker body', body);

  res.statusCode = 200;
  res.json({ challenge });
  res.end();
});

router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'hi' });
  res.statusCode = 200;
  res.end();
});

export default router;

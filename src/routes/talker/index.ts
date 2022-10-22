import express from 'express';
import { Request, Response } from 'express';

const allowedChannels = [
  'G06GSTTGB', // classic
];

const maxEvents = 25;
let events: any[] = [];

const router = express.Router();

router.post('/', (req: Request, res: Response) => {
  console.log('/talker');
  const { body } = req;
  const { challenge, event } = body;
  const { channel } = event;

  if (allowedChannels.includes(channel)) {
    events = events.concat(body).sort((a, b) => {
      return a.event_time > b.event_time ? 1 : -1;
    });

    if (events.length > maxEvents) {
      events = [...events.slice(0, 0), ...events.slice(1)];
    }
  }

  res.statusCode = 200;
  res.json({ challenge });
  res.end();
});

router.get('/', (req: Request, res: Response) => {
  res.json(events);
  res.statusCode = 200;
  res.end();
});

export default router;

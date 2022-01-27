import express from 'express';
import { Request, Response } from 'express';
import answers from './answers';
import { getRandItem } from './../../util';

const router = express.Router();

router.post('/', (req: Request, res: Response) => {
  try {
    const answer = getRandItem(answers);

    const slackResponse = {
      response_type: 'in_channel',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `${answer}`,
          },
        },
      ],
    };

    res.json(slackResponse);
  } catch (e) {
    console.error('an error occurred');
    console.error(e);
    res.status(500).send('error');
  }
});

export default router;

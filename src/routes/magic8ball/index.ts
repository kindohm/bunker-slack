import express from 'express';
import { Request, Response } from 'express';
import answers from './answers';
import { getRandItem } from './../../util';

const router = express.Router();

router.post('/', (req: Request, res: Response) => {
  try {
    const answer = getRandItem(answers);
    const { body } = req;
    const { text, user_name }: { text: string; user_name: string } = body;

    const slackResponse = {
      response_type: 'in_channel',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `_${user_name} shakes the magic 8 ball and asks \"${text}\"_`,
          },
        },
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

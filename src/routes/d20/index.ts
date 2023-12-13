import express from 'express';
import { Request, Response } from 'express';
import { sendDelayedResponse } from '../../delayedResponse';
import { get1d20 } from '../../lib/d20';

const router = express.Router();

router.post('/', (req: Request, res: Response) => {
  try {
    console.log('/d20');
    const { body } = req;
    const { response_url, user_name, text } = body;
    const answer = get1d20(user_name);

    const responseBody = {
      response_type: 'in_channel',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `:d20: ${answer}`,
          },
        },
      ],
    };

    sendDelayedResponse({
      res,
      response_url,
      responseBody,
      showOriginalMessage: true,
    });
  } catch (e) {
    console.error('an error occurred');
    console.error(e);
    res.status(500).send('error');
  }
});

export default router;

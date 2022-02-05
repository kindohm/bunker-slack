import express from 'express';
import { Request, Response } from 'express';
import answers from './answers';
import { getRandItem } from './../../util';
import { sendDelayedResponse } from '../../delayedResponse';

const router = express.Router();

router.post('/', (req: Request, res: Response) => {
  try {
    console.log('/magic8ball');
    const { body } = req;
    const { response_url, user_name, text } = body;
    const answer = getRandItem(answers);

    console.log({ user_name, text, answer });

    const responseBody = {
      response_type: 'in_channel',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `:magic8balls: ${answer}`,
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

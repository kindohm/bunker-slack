import express from 'express';
import { Request, Response } from 'express';
import { answers, thvAnswers } from './answers';
import { getRandItem } from './../../util';
import { sendDelayedResponse } from '../../delayedResponse';

const router = express.Router();

const respond = (req: Request, res: Response, availableAnswers: string[]) => {
  try {
    console.log('/magic8ball');
    const { body } = req;
    const { response_url, user_name, text } = body;

    const answer = getRandItem(availableAnswers);

    console.log({ user_name, text, answer });

    const responseBody = {
      response_type: 'in_channel',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `:magic8ball: ${answer}`,
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
};

router.post('/', (req: Request, res: Response) => {
  console.log('/magic8ball');
  return respond(req, res, answers);
});

router.post('/thv', (req: Request, res: Response) => {
  console.log('/magic8ball/thv');
  return respond(req, res, thvAnswers);
});

export default router;

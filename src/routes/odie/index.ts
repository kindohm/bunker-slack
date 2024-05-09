import express from 'express';
import { Request, Response } from 'express';
import { sendDelayedResponse } from '../../delayedResponse';
import { getRandItem } from './../../util';

const router = express.Router();

const transform = (phrase: string): string => {
  if (!phrase.trim()) {
    return 'huffalumpalump';
  }

  return phrase.replace(/[s]/g, 'th');
};

router.post('/', (req: Request, res: Response) => {
  try {
    console.log('/odie');
    const { body } = req;
    const { response_url, user_name, text } = body;
    const result = transform(text);
    const finalTransform =
      Math.random() > 0.75 ? `${result}, huffalumpalump` : result;
    const final = `:odie: "${finalTransform}" - Odie`;

    console.log({ user_name, text, final });

    const responseBody = {
      response_type: 'in_channel',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: final,
          },
        },
      ],
    };

    sendDelayedResponse({
      res,
      response_url,
      responseBody,
      showOriginalMessage: false,
      delay: 1000,
    });
  } catch (e) {
    console.error('an error occurred');
    console.error(e);
    res.status(500).send('error');
  }
});

export default router;

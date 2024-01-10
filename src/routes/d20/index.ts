import express from 'express';
import { Request, Response } from 'express';
import { sendDelayedResponse } from '../../delayedResponse';
import { get1d20 } from '../../lib/d20';

const router = express.Router();

const getDc = (text: string) => {
  try {
    if (!text) return 10;
    const idx = text.indexOf('--dc=');
    if (idx < 0) return 10;
    const num = parseInt(text.substring(5));
    if (isNaN(num)) return 10;
    return Math.max(0, Math.min(20, num));
  } catch {
    return 10;
  }
};

router.post('/', (req: Request, res: Response) => {
  try {
    console.log('/d20');
    const { body } = req;
    const { response_url, user_name, text } = body;

    const dc = getDc(text);

    const answer = get1d20(user_name, dc);

    const responseBody = {
      response_type: 'in_channel',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `:d20: [DC${dc}] ${answer}`,
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

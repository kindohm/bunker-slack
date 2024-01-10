import express from 'express';
import { Request, Response } from 'express';
import { sendDelayedResponse } from '../../delayedResponse';
import { getTyson } from '../../lib/tyson';

const router = express.Router();

router.post('/', (req: Request, res: Response) => {
  try {
    console.log('/neildegrassetysonfact');
    const { body } = req;
    console.log('full body', body);
    const { response_url } = body;
    const answer = getTyson();

    const responseBody = {
      response_type: 'in_channel',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `> ${answer}\n>\n> - Neil deGrasse Tyson`,
          },
          accessory: {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Click Me',
              emoji: true,
            },
            value: 'click_me_123',
            action_id: 'button-action',
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

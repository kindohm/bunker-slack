import express from 'express';
import { Request, Response } from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/', (req: Request, res: Response) => {
  try {
    const { body } = req;
    const { response_url, text, user_name } = body;

    if (response_url) {
      console.log('response_url', response_url);
      setTimeout(async () => {
        try {
          const slackResponse = {
            response_type: 'in_channel',
            blocks: [
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `this is your answer`,
                },
              },
            ],
          };
          await axios.post(response_url, slackResponse);
        } catch (err) {
          console.error('error on delayed POST');
          console.error(err);
        }
      }, 2000);
    } else {
      console.log('no response url!');
    }

    const immediateResponse = {
      response_type: 'in_channel',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `${user_name} shakes the magic 8 ball and asks "${text}"`,
          },
        },
      ],
    };

    res.status(200).send(immediateResponse);
  } catch (e) {
    console.error('an error occurred');
    console.error(e);
    res.status(500).send('error');
  }
});

router.post('/noop', (req: Request, res: Response) => {
  console.log('noop');
  res.status(200);
});

export default router;

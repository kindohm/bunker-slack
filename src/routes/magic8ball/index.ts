import express from 'express';
import { Request, Response } from 'express';
import axios from 'axios';
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

    console.log(user_name, text, answer);

    const responseBody = {
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

    sendDelayedResponse({ res, response_url, responseBody });

    //   if (response_url) {
    //     console.log('response_url', response_url);
    //     console.log('answer', answer);
    //     // must send empty response immediately
    //     res.status(200).send(EMPTY_RESPONSE);
    //     console.log(`sending response in ${DELAY_TIME}ms`);

    //     // send actual Magic 8 Ball answer in the future
    //     setTimeout(async () => {
    //       try {
    //         await axios.post(response_url, slackResponse);
    //       } catch (err) {
    //         console.error('error posting to response_url');
    //         console.error(err.response.status);
    //         console.error(err.response.statusText);
    //         console.error(err.request.path);
    //         console.error(err.response.data);
    //       }
    //     }, DELAY_TIME);
    //   } else {
    //     console.warn('there was no response_url');
    //     res.json(slackResponse);
    //   }
  } catch (e) {
    console.error('an error occurred');
    console.error(e);
    res.status(500).send('error');
  }
});

export default router;

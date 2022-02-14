import express from 'express';
import { Request, Response } from 'express';
import { sendDelayedResponse } from '../../delayedResponse';
import { getRandItem } from './../../util';

const router = express.Router();

const nope = ':wat:';

const oobIt = (phrase: string): string => {
  if (!phrase.trim()) {
    return nope;
  }

  return phrase.replace(/[aeiouAEIOU]/g, 'oob');
};

const randomEmojis = [
  'awwyiss',
  'notsureif',
  'awyeah',
  'blah',
  'chefkiss',
  'confuse',
  'duckhunt',
  'elmofire',
  'excellent2',
  'hansolo',
  'itsatrap',
  'notbad',
  'orly',
  'rip',
  'tapping-head',
  'youdontsay',
];

const getRandomEmoji = (): string => {
  return getRandItem(randomEmojis);
};

router.post('/', (req: Request, res: Response) => {
  try {
    console.log('/oob');
    const { body } = req;
    const { response_url, user_name, text } = body;
    const result = oobIt(text);
    const randomEmoji = getRandomEmoji();

    const final = result === nope ? result : `:${randomEmoji}: ${result}`;

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
      showOriginalMessage: true,
    });
  } catch (e) {
    console.error('an error occurred');
    console.error(e);
    res.status(500).send('error');
  }
});

export default router;

import express from 'express';
import { Request, Response } from 'express';
import { sendDelayedResponse } from '../../delayedResponse';
import { getRandItem } from './../../util';
import emojiList from './emojiList';

const router = express.Router();

const nope = ':wat:';

const oobIt = (phrase: string): string => {
  if (!phrase.trim()) {
    return nope;
  }

  return phrase.replace(/[aeiouAEIOU]/g, 'oob');
};

const getRandomEmoji = (): string => {
  return getRandItem(emojiList);
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
      delay: 1000,
    });
  } catch (e) {
    console.error('an error occurred');
    console.error(e);
    res.status(500).send('error');
  }
});

export default router;

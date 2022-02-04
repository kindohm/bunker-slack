import express from 'express';
import tracery from 'tracery-grammar';
import { getRandItem } from './../../util';
import structures from './structures';
import { Request, Response } from 'express';
import { sendDelayedResponse } from './../../delayedResponse';

const router = express.Router();

const getRandomSentence = async () => {
  const grammar = tracery.createGrammar(getRandItem(structures));
  grammar.addModifiers(tracery.baseEngModifiers);
  return grammar.flatten('#origin#');
};

router.post('/', async (req: Request, res: Response) => {
  try {
    console.log('/soulsphere');
    const { body } = req;
    const { response_url, text, user_name } = body;
    const sentence = await getRandomSentence();
    console.log({ user_name, text, sentence });
    const responseBody = {
      response_type: 'in_channel',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: sentence,
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

import express from 'express';
import tracery from 'tracery-grammar';
import { getRandItem } from './../../util';
import structures from './structures';
import { Request, Response } from 'express';
import getShakeText from './getShakeText';

const router = express.Router();

const getRandomSentence = async () => {
  const grammar = tracery.createGrammar(getRandItem(structures));
  grammar.addModifiers(tracery.baseEngModifiers);
  return grammar.flatten('#origin#');
};

router.post('/', async (req: Request, res: Response) => {
  try {
    const { body } = req;
    const { text, user_name }: { text: string; user_name: string } = body;
    const sentence = await getRandomSentence();
    const shakeText = getShakeText(user_name, text);
    const slackResponse = {
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

    res.json(slackResponse);
  } catch (e) {
    console.error('an error occurred');
    console.error(e);
    res.status(500).send('error');
  }
});

export default router;

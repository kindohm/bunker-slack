import express from 'express';
import tracery from 'tracery-grammar';
import { getRandItem } from './../../util';
import structures from './structures';
import { Request, Response } from 'express';

const router = express.Router();

const getRandomSentence = async () => {
  const grammar = tracery.createGrammar(getRandItem(structures));
  grammar.addModifiers(tracery.baseEngModifiers);
  return grammar.flatten('#origin#');
};

router.post('/', async (req: Request, res: Response) => {
  try {
    const sentence = await getRandomSentence();
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

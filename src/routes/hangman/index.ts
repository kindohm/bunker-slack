import express from 'express';
import { Request, Response } from 'express';
import { sendDelayedResponse } from '../../delayedResponse';
import { IGame, createGame, guess } from './game';

const MAX_GUESSES = 5;
const router = express.Router();

interface IGames {
  [key: string]: IGame;
}

let games: IGames = {};

const handleNewGameRequest = (
  res: Response,
  response_url: string,
  username: string
) => {
  const game: IGame = createGame(username);

  games[username] = game;

  const responseBody = {
    response_type: 'in_channel',
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `${username} started a new game of hangman.`,
        },
      },
    ],
  };

  sendDelayedResponse({ res, response_url, responseBody });
};

const handleGuess = (
  res: Response,
  response_url: string,
  game: IGame,
  text: string
) => {
  guess(game, text);

  const responseBody = {
    response_type: 'in_channel',
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `${game.username} guessed ${text}.`,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: game.guesses.join(', '),
        },
      },
    ],
  };

  sendDelayedResponse({ res, response_url, responseBody });
};

router.post('/', (req: Request, res: Response) => {
  try {
    console.log('/hangman');
    const { body } = req;
    const { response_url, user_name, text } = body;

    const game = games[user_name];
    if (!game) {
      return handleNewGameRequest(res, response_url, user_name);
    }

    return handleGuess(res, response_url, game, text);
  } catch (e) {
    console.error('an error occurred');
    console.error(e);
    res.status(500).send('error');
  }
});

export default router;

import express from 'express';
import { Request, Response } from 'express';
import { sendDelayedResponse } from '../../delayedResponse';

const MAX_GUESSES = 5;
const router = express.Router();

interface IGame {
  username: string;
  word: string;
  guesses: string[];
}

interface IGames {
  [key: string]: IGame;
}

let games: IGames = {};

const handleNewGameRequest = (
  res: Response,
  response_url: string,
  username: string
) => {
  const game: IGame = { username, word: 'the', guesses: [] };

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
  username: string,
  text: string
) => {
  const guesses = [...game.guesses, text];
  const updatedGame = { ...game, guesses };
  games[username] = updatedGame;

  const responseBody = {
    response_type: 'in_channel',
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `${username} guessed ${text}.`,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: guesses.join(', '),
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

    return handleGuess(res, response_url, game, user_name, text);
  } catch (e) {
    console.error('an error occurred');
    console.error(e);
    res.status(500).send('error');
  }
});

export default router;

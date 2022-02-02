import express from 'express';
import { Request, Response } from 'express';
import { sendDelayedResponse } from '../../delayedResponse';
import { IGame, createGame, guess, getGameDisplay, GameState } from './game';

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
  const display = getGameDisplay(game);

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
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `\`${display}\``,
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
  const newGame = guess(game, text);

  console.log('newGame', newGame);
  games[newGame.username] = newGame;

  const display = getGameDisplay(newGame);

  const responseBody = {
    response_type: 'in_channel',
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `\`${
            newGame.username
          }/hangman> ${display} | guesses: ${newGame.guesses
            .map((g) => g.guess)
            .join(', ')}\``,
        },
      },
    ],
  };

  if (newGame.state === GameState.Win) {
    responseBody.blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: `${newGame.username} wins!` },
    });
    games[game.username] = undefined;
  } else if (newGame.state === GameState.Lose) {
    responseBody.blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: `${newGame.username} loses.` },
    });

    games[game.username] = undefined;
  }

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

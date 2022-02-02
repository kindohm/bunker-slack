import express from 'express';
import { Request, Response } from 'express';
import { sendDelayedResponse } from '../../delayedResponse';
import {
  IGame,
  createGame,
  guess,
  getGameDisplay,
  GameState,
  MaxGuesses,
} from './game';

const responseDelay = 500;

const router = express.Router();

interface IGames {
  [key: string]: IGame;
}

let games: IGames = {};

const getBlock = (text: string, type: string = 'mrkdwn') => {
  return {
    type: 'section',
    text: {
      type,
      text,
    },
  };
};

const getHeaderBlock = (game: IGame) => {
  const { username } = game;
  return getBlock(`*Hangman™* (${username})`);
};

const getWordDisplayBlock = (wordDisplay: string) => {
  return getBlock(`word: ${wordDisplay}`, 'plain_text');
};

const getGuessesBlock = (game: IGame) => {
  const { guesses, badGuessCount } = game;
  const remaining = MaxGuesses - badGuessCount;
  return getBlock(
    `guesses: ${guesses
      .map((g) => g.guess)
      .join(', ')} (${remaining} remaining)`
  );
};

const getWinBlock = (game: IGame) => {
  const { username } = game;
  return getBlock(`${username} wins!`);
};

const getLoseBlock = (game: IGame) => {
  const { username } = game;
  return getBlock(`${username} loses.`);
};

const getStartBlock = (game: IGame) => {
  const { username } = game;
  return getBlock(`${username} started a new game of Hangman™.`);
};

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
      getHeaderBlock(game),
      getStartBlock(game),
      getWordDisplayBlock(display),
    ],
  };

  sendDelayedResponse({
    res,
    response_url,
    responseBody,
    delay: responseDelay,
  });
};

const handleGuess = (
  res: Response,
  response_url: string,
  game: IGame,
  text: string
) => {
  const updatedGame = guess(game, text);

  games[updatedGame.username] = updatedGame;

  const display = getGameDisplay(updatedGame);

  const responseBody = {
    response_type: 'in_channel',
    blocks: [
      getHeaderBlock(updatedGame),
      getWordDisplayBlock(display),
      getGuessesBlock(updatedGame),
    ],
  };

  if (updatedGame.state === GameState.Win) {
    responseBody.blocks.push(getWinBlock(updatedGame));
    games[game.username] = undefined;
  } else if (updatedGame.state === GameState.Lose) {
    responseBody.blocks.push(getLoseBlock(updatedGame));
    games[game.username] = undefined;
  }

  sendDelayedResponse({
    res,
    response_url,
    responseBody,
    delay: responseDelay,
  });
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

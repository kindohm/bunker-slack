import express from 'express';
import { Request, Response } from 'express';
import { sendDelayedResponse } from '../../delayedResponse';
import { IGame, createGame, guess, getGameDisplay, GameState } from './game';

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

const getHeaderBlock = () => {
  return getBlock('*Hangman™*');
};

const getWordDisplayBlock = (wordDisplay: string) => {
  return getBlock(`word: ${wordDisplay}`, 'plain_text');
};

const getGuessesBlock = (game: IGame) => {
  const { guesses } = game;
  return getBlock(`guesses: ${guesses.map((g) => g.guess).join(', ')}`);
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
      getHeaderBlock(),
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
  const newGame = guess(game, text);

  games[newGame.username] = newGame;

  const display = getGameDisplay(newGame);

  const responseBody = {
    response_type: 'in_channel',
    blocks: [
      getHeaderBlock(),
      getWordDisplayBlock(display),
      getGuessesBlock(newGame),
    ],
  };

  if (newGame.state === GameState.Win) {
    responseBody.blocks.push(getWinBlock(newGame));
    games[game.username] = undefined;
  } else if (newGame.state === GameState.Lose) {
    responseBody.blocks.push(getLoseBlock(newGame));
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

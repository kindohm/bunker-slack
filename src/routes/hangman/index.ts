import express from 'express';
import { Request, Response } from 'express';
import { sendDelayedResponse } from '../../delayedResponse';
import { randomWord } from './words';
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

const getHeaderBlock = (game: IGame) => {
  const { username } = game;
  return getBlock(`*Hangman™* (${username})`);
};

const getSingleLineDisplayBlock = (game: IGame) => {
  const emoticon = `:hangman${game.badGuessCount}:`;
  const display = getGameDisplay(game);
  const badGuesses = game.guesses.filter((g) => {
    return !g.isMatch;
  });

  const guesses = `[${badGuesses
    .map((g) => g.guess.toUpperCase())
    .join(', ')}]`;
  return getBlock(`${emoticon} ${display} ${guesses}`, 'plain_text');
};

const getWinBlock = (game: IGame) => {
  const { username } = game;
  return getBlock(`${username} wins! 🎉`);
};

const getLoseBlock = (game: IGame) => {
  const { username } = game;
  return getBlock(`${username} loses. 👎`);
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
  const game: IGame = createGame(username, randomWord());

  console.log('started new game:', username, game.word);

  games[username] = game;

  console.log(
    'current games:',
    Object.keys(games)
      .map((k) => k)
      .join(', ')
  );

  const responseBody = {
    response_type: 'in_channel',
    blocks: [
      getHeaderBlock(game),
      getStartBlock(game),
      getSingleLineDisplayBlock(game),
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
  console.log(`${game.username} guessed ${text}`);
  const sanitized = text.toLowerCase();
  const isValidGuess = /^[a-z]+$/.test(sanitized);
  if (!isValidGuess) {
    const invalidBody = {
      response_type: 'in_channel',
      blocks: [
        getHeaderBlock(game),
        getBlock(`_"${text}" is not a valid guess. Try only using letters._`),
        getSingleLineDisplayBlock(game),
      ],
    };

    return sendDelayedResponse({
      res,
      response_url,
      responseBody: invalidBody,
      delay: responseDelay,
    });
  }

  const updatedGame = guess(game, sanitized);

  games[updatedGame.username] = updatedGame;

  const responseBody = {
    response_type: 'in_channel',
    blocks: [
      getHeaderBlock(updatedGame),
      getSingleLineDisplayBlock(updatedGame),
    ],
  };

  // if game is over, add final message to response, and
  // delete game from the hash.
  if (
    updatedGame.state === GameState.Win ||
    updatedGame.state === GameState.Lose
  ) {
    console.log('game over', updatedGame.username, updatedGame.state);
    responseBody.blocks.push(
      updatedGame.state === GameState.Win
        ? getWinBlock(updatedGame)
        : getLoseBlock(updatedGame)
    );
    games = { ...games, [game.username]: undefined };
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

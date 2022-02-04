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

const getSingleLineDisplayBlock = (game: IGame) => {
  const emoticon = `:hangman${game.badGuessCount}:`;
  const display = getGameDisplay(game);
  const badGuesses = game.guesses.filter((g) => {
    return !g.isMatch;
  });

  const guesses =
    badGuesses.length > 0
      ? `[${badGuesses.map((g) => g.guess.toUpperCase()).join(', ')}] `
      : '';

  const winLoseText =
    game.state === GameState.InProgress
      ? ``
      : game.state === GameState.Win
      ? `You win! 🎉`
      : `You lose. 👎`;

  return getBlock(
    `Hangman™ ${emoticon} ${display} ${guesses}${winLoseText}`,
    'plain_text'
  );
};

const handleNewGameRequest = (
  res: Response,
  response_url: string,
  username: string,
  channel_name: string
) => {
  const game: IGame = createGame(channel_name, randomWord());

  console.log(
    `${username} started new game in #${channel_name} with the word "${game.word}"`
  );

  games[channel_name] = game;

  console.log(
    'current games:',
    Object.keys(games)
      .map((k) => k)
      .join(', ')
  );

  const responseBody = {
    response_type: 'in_channel',
    blocks: [getSingleLineDisplayBlock(game)],
  };

  sendDelayedResponse({
    res,
    response_url,
    responseBody,
    delay: responseDelay,
    showOriginalMessage: false,
  });
};

const handleGuess = (
  res: Response,
  response_url: string,
  game: IGame,
  username: string,
  text: string
) => {
  console.log(`${username} guessed ${text} in ${game.channel}`);

  const sanitized = text.toLowerCase();
  const isValidGuess = /^[a-z]+$/.test(sanitized);

  if (!isValidGuess) {
    const invalidBody = {
      response_type: 'in_channel',
      blocks: [getSingleLineDisplayBlock(game)],
    };

    return sendDelayedResponse({
      res,
      response_url,
      responseBody: invalidBody,
      delay: responseDelay,
      showOriginalMessage: false,
    });
  }

  const updatedGame = guess(game, sanitized);

  games[updatedGame.channel] = updatedGame;

  const responseBody = {
    response_type: 'in_channel',
    blocks: [getSingleLineDisplayBlock(updatedGame)],
  };

  // if game is over, add final message to response, and
  // delete game from the hash.
  if (
    updatedGame.state === GameState.Win ||
    updatedGame.state === GameState.Lose
  ) {
    console.log('game over', updatedGame.channel, updatedGame.state);
    games = { ...games, [game.channel]: undefined };
  }

  sendDelayedResponse({
    res,
    response_url,
    responseBody,
    delay: responseDelay,
    showOriginalMessage: false,
  });
};

router.post('/', (req: Request, res: Response) => {
  try {
    console.log('/hangman');
    const { body } = req;
    const { response_url, user_name, channel_name, text } = body;

    const game = games[channel_name];
    if (!game) {
      return handleNewGameRequest(res, response_url, user_name, channel_name);
    }

    return handleGuess(res, response_url, game, user_name, text);
  } catch (e) {
    console.error('an error occurred');
    console.error(e);
    res.status(500).send('error');
  }
});

export default router;

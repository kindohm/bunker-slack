export const MaxGuesses = 6;

export enum GameState {
  InProgress,
  Win,
  Lose,
}

export interface IGuess {
  guess: string;
  isMatch: boolean;
}

export interface IGame {
  channel: string;
  word: string;
  guesses: IGuess[];
  state: GameState;
  matches: boolean[];
  badGuessCount: number;
}

interface IMatchResult {
  matches: boolean[];
  isMatch: boolean;
}

export const createGame = (channel: string, word: string = 'bunker'): IGame => {
  const game: IGame = {
    channel,
    word,
    guesses: [],
    state: GameState.InProgress,
    matches: word.split('').map(() => false),
    badGuessCount: 0,
  };
  return game;
};

const getMatchResult = (
  word: string,
  guess: string,
  matches: boolean[]
): IMatchResult => {
  if (guess.length <= 1) {
    const reg = new RegExp(guess, 'g');
    const regexMatches = [...word.matchAll(reg)];

    const newMatches = regexMatches.reduce((newMatchesLocal, guessMatch) => {
      const { index } = guessMatch;
      return Object.assign([], newMatchesLocal, { [index]: true });
    }, matches);

    return { matches: newMatches, isMatch: regexMatches.length > 0 };
  }

  if (guess === word) {
    return { matches: matches.map((m) => true), isMatch: true };
  }

  return { matches, isMatch: false };
};

export const guess = (game: IGame, guess: string = ' '): IGame => {
  const { word, guesses, matches, state, badGuessCount } = game;
  if (state !== GameState.InProgress) {
    throw new Error('Cannot guess when game is over.');
  }
  const result: IMatchResult = getMatchResult(word, guess, matches);
  const newBadGuessCount = result.isMatch ? badGuessCount : badGuessCount + 1;
  const newGuess: IGuess = { guess, isMatch: result.isMatch };
  const newGuesses = guesses.concat(newGuess);
  const win = result.matches.filter((m) => m === false).length === 0;

  const newState = win
    ? GameState.Win
    : newBadGuessCount === MaxGuesses
    ? GameState.Lose
    : GameState.InProgress;

  return {
    ...game,
    guesses: newGuesses,
    state: newState,
    matches: result.matches,
    badGuessCount: newBadGuessCount,
  };
};

export const separator = '_';

export const getGameDisplay = (game: IGame): string => {
  const chars = game.word.split('');
  return chars
    .map((c, i): string => {
      return game.state !== GameState.InProgress || game.matches[i]
        ? c.toUpperCase()
        : separator;
    })
    .join(' ');
};

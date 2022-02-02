export enum GameState {
  InProgress,
  Win,
  Lose,
}

export interface IGame {
  username: string;
  word: string;
  guesses: string[];
  state: GameState;
  badGuessCount: number;
  display: string[];
}

export const createGame = (username: string): IGame => {
  const game: IGame = {
    username,
    word: 'the',
    guesses: [],
    state: GameState.InProgress,
    badGuessCount: 0,
    display: [],
  };
  return game;
};

export const guess = (game: IGame, guess: string): IGame => {
  return game;
};

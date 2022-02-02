import { createGame, GameState, guess, getGameDisplay } from './game';

describe('game', () => {
  describe('createGame', () => {
    it('should return new game with initial values', () => {
      const game = createGame('hank', 'hoop');
      const { guesses, state, word, username, matches } = game;
      expect(guesses).toEqual([]);
      expect(state).toEqual(GameState.InProgress);
      expect(username).toEqual('hank');
      expect(word).toEqual('hoop');
      expect(matches.length).toEqual(4);
      expect(matches).toEqual([false, false, false, false]);
    });
  });

  describe('guess', () => {
    const testWord = 'asdf';
    const username = 'hank';

    describe('guesses', () => {
      it('should add a new guess', () => {
        const game = createGame(username, testWord);
        const game2 = guess(game, 'x');
        expect(game2.guesses).toEqual([{ guess: 'x', isMatch: false }]);
        const game3 = guess(game2, 'a');
        expect(game3.guesses).toEqual([
          { guess: 'x', isMatch: false },
          { guess: 'a', isMatch: true },
        ]);

        const game4 = guess(game3, 'd');
        expect(game4.guesses).toEqual([
          { guess: 'x', isMatch: false },
          { guess: 'a', isMatch: true },
          { guess: 'd', isMatch: true },
        ]);
      });
    });

    describe('matches', () => {
      it('should add two matches for two good guesses', () => {
        const game = createGame('hank', 'asdf');
        const game2 = guess(game, 'a');
        expect(game2.matches).toEqual([true, false, false, false]);
        const game3 = guess(game2, 'd');
        expect(game3.matches).toEqual([true, false, true, false]);
      });
    });

    describe('state', () => {
      it('should end game after all bad guesses', () => {
        const game = createGame(username, testWord);
        const game2 = guess(game, 'x');
        const game3 = guess(game2, 'y');
        const game4 = guess(game3, 'z');
        const game5 = guess(game4, 'u');
        const game6 = guess(game5, 'q');
        const game7 = guess(game6, '*');
        expect(game7.state).toEqual(GameState.Lose);
      });

      it('should end game after mostly bad guesses', () => {
        const game = createGame(username, testWord);
        const game2 = guess(game, 'a');
        const game3 = guess(game2, 'y');
        const game4 = guess(game3, 'z');
        const game5 = guess(game4, 'u');
        const game6 = guess(game5, 'q');
        const game7 = guess(game6, 'x');
        expect(game7.state).toEqual(GameState.InProgress);
        const game8 = guess(game7, 'x');
        expect(game8.state).toEqual(GameState.Lose);
      });

      it('should lose after all good guesses followed by six successive bad guesses', () => {
        const game = createGame(username, testWord);
        const game2 = guess(game, 'a');
        const game3 = guess(game2, 's');
        const game4 = guess(game3, 'd');
        const game5 = guess(game4, 'x');
        const game6 = guess(game5, 'y');
        const game7 = guess(game6, 'z');
        const game8 = guess(game7, 'v');
        const game9 = guess(game8, 'q');
        const game10 = guess(game9, 'u');
        expect(game10.state).toEqual(GameState.Lose);
      });

      it('should win game after all good guesses', () => {
        const game = createGame(username, testWord);
        const game2 = guess(game, 'a');
        const game3 = guess(game2, 's');
        const game4 = guess(game3, 'd');
        const game5 = guess(game4, 'f');
        expect(game5.state).toEqual(GameState.Win);
      });

      it('should win game after mostly good guesses', () => {
        const game = createGame(username, testWord);
        const game1 = guess(game, 'x');
        const game2 = guess(game1, 'a');
        const game3 = guess(game2, 's');
        const game4 = guess(game3, 'd');
        const game5 = guess(game4, 'f');
        expect(game5.state).toEqual(GameState.Win);
      });

      it('should not allow guess is state is Lose', (done) => {
        try {
          const game = createGame(username, testWord);
          game.state = GameState.Lose;
          guess(game, 'x');
        } catch (err) {
          expect(err.message).toEqual('Cannot guess when game is over.');
          done();
        }
      });

      it('should not allow guess is state is Win', (done) => {
        try {
          const game = createGame(username, testWord);
          game.state = GameState.Win;
          guess(game, 'x');
        } catch (err) {
          expect(err.message).toEqual('Cannot guess when game is over.');
          done();
        }
      });
    });

    describe('getGameDisplay', () => {
      it('should show all underscores when no matches', () => {
        const game = createGame('', 'asdf');
        const display = getGameDisplay(game);
        expect(display).toEqual('_ _ _ _');
      });

      it('should show letter at single match position', () => {
        const game = createGame('', 'asdf');
        game.matches = [false, true, false, false];
        const display = getGameDisplay(game);
        expect(display).toEqual('_ s _ _');
      });

      it('should show letter at multiple match position', () => {
        const game = createGame('', 'asdf');
        game.matches = [false, true, false, true];
        const display = getGameDisplay(game);
        expect(display).toEqual('_ s _ f');
      });

      it('should show correct display for a longer word', () => {
        const game = createGame('hank', 'bunker');
        const display = getGameDisplay(game);
        expect(display).toEqual('_ _ _ _ _ _');
      });
    });
  });
});

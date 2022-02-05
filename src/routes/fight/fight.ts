export enum FightState {
  Challenged,
  Completed,
}

export interface IFight {
  state: FightState;
  challenger: string;
  opponent: string;
  createdAt: Date;
  rounds: IFightRound[];
  getWinner(): string;
  getLoser(): string;
}

export interface IFightRound {
  opponentMove: string;
  challengerMove: string;
}

import { Request, Response } from 'express';
import { IFight } from './fight';

export interface IFightRouteResponse {
  body: any;
  status: number;
}

interface IFights {
  [key: string]: IFight;
}
let fights: IFights = {};

const getFightKey = (
  player1: string,
  player2: string,
  room: string
): string => {
  return `${player1}-${player2}-${room}`;
};

export const getResponse = (
  userName: string,
  channelName: string,
  text: string
): IFightRouteResponse => {
  // text format:
  // <@[playername]> [move] [move] [move]
  return { body: {}, status: 200 };
};

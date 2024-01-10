import { randInt } from '../util';

export enum BuffType {
  CONSTANT = 100,
  ROLL = 200,
}

export type Buff = {
  buffName: string;
  max: number;
  buffType: BuffType;
};

export type BuffResult = Buff & { result: number };

export type RollResult = {
  dc: number;
  advantage: boolean;
  buffs: BuffResult[];
  total: number;
  success: boolean;
  critical: boolean;
  rolls: number[];
};

export type Options = {
  dc: number;
  advantage: boolean;
  buffs: Buff[];
};

export const get1d20 = (options: Options): RollResult => {
  const { buffs, dc, advantage } = options;
  const buffResults = buffs.map((buff) => {
    return {
      ...buff,
      result: buff.buffType === BuffType.ROLL ? randInt(1, buff.max) : buff.max,
    };
  });

  const buffSum = buffResults.reduce((sum, buff) => {
    return sum + buff.result;
  }, 0);

  const rolls = [randInt(1, 20)].concat(advantage ? [randInt(1, 20)] : []);

  const highRoll = Math.max(rolls[0], rolls.length > 1 ? rolls[1] : -1);

  const total = highRoll + buffSum;
  const critical = total === 1 || total === 20;
  const success = total >= dc;

  return { ...options, buffs: buffResults, rolls, total, success, critical };
};

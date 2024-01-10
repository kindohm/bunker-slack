import { randInt } from '../util';

export type Buff = {
  buffName: string;
  max: number;
};

export type BuffResult = Buff & { result: number };

export type RollResult = {
  dc: number;
  buffs: BuffResult[];
  roll: number;
  total: number;
  success: boolean;
  critical: boolean;
};

export const get1d20 = (dc: number, buffs: Buff[]): RollResult => {
  const buffResults = buffs.map((buff) => {
    return { ...buff, result: randInt(1, buff.max) };
  });
  const buffSum = buffResults.reduce((sum, buff) => {
    return sum + buff.result;
  }, 0);

  const roll = randInt(1, 20);
  const total = roll + buffSum;
  const critical = total === 1 || total === 20;
  const success = total >= dc;

  return { dc, buffs: buffResults, roll, total, success, critical };
};

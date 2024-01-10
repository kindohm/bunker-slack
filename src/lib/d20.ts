import { randInt } from '../util';

export const get1d20 = (user: string, dc: number) => {
  const roll = randInt(1, 20);
  const critical = roll === 1 || roll === 20;
  const success = roll >= dc ? 'SUCCESS' : 'FAILURE';
  const msg = critical ? `CRITICAL ${success}` : success;

  return `${user} rolled ${roll} [${msg}]`;
};

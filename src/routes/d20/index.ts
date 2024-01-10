import express from 'express';
import { Request, Response } from 'express';
import { sendDelayedResponse } from '../../delayedResponse';
import { Buff, BuffType, Options, RollResult, get1d20 } from '../../lib/d20';
import { EOL } from 'os';

const router = express.Router();

const getDc = (text: string) => {
  try {
    if (!text) return 10;
    const idx = text.indexOf('--dc=');
    if (idx < 0) return 10;
    const num = parseInt(text.substring(5));
    if (isNaN(num)) return 10;
    return Math.max(0, Math.min(99, num));
  } catch {
    return 10;
  }
};

const getBuff = (text: string): Buff => {
  try {
    if (!text) return null;
    const idx = text.indexOf('--buff:');
    if (idx < 0) return null;
    const remainder = text.substring(7);
    if (remainder.length === 0) {
      return null;
    }
    const rest = remainder.split('=');
    const [buffName, buffRawVal] = rest;
    const type = buffRawVal ? BuffType.CONSTANT : BuffType.ROLL;
    const buffVal = buffRawVal ? parseInt(buffRawVal) : 4;
    const max = isNaN(buffVal) ? 4 : buffVal;
    return { buffName, max, buffType: type };
  } catch {
    return null;
  }
};

const getOptionsFromFlags = (flags: string[]): Options => {
  const opts = flags.reduce(
    (options, flag) => {
      if (flag.startsWith('--advantage')) {
        return { ...options, advantage: true };
      }

      if (flag.startsWith('--dc=')) {
        return { ...options, dc: getDc(flag) };
      }

      if (flag.startsWith('--buff:')) {
        const buff = getBuff(flag);
        if (buff) {
          const newBuffs = options.buffs.concat(buff);
          return { ...options, buffs: newBuffs };
        }
        return options;
      }

      return options;
    },
    { dc: 10, advantage: false, buffs: [] }
  );

  return opts;
};

const getResponseText = (user_name: string, result: RollResult) => {
  const { dc, rolls, total, critical, success, buffs, advantage } = result;

  console.log('everything', result);

  const outcomeText = success ? 'SUCCESS' : 'FAILURE';
  const outcomeTextAll = `[${
    critical ? `CRITICAL ${outcomeText}` : outcomeText
  }]`;

  const main = `:d20: [DC${dc}] ${user_name} rolled ${total} ${outcomeTextAll}`;
  if (rolls.length === 1 && (!buffs || buffs.length === 0)) {
    return main;
  }

  const rollText = rolls
    .map((roll) => {
      return `- roll: ${roll}`;
    })
    .join(EOL);
  const buffText = buffs
    .map((buff) => {
      return `- ${buff.buffName}${
        buff.buffType === BuffType.ROLL ? ` [1d${buff.max}]` : ''
      }: +${buff.result}`;
    })
    .join(`${EOL}`);

  return `${main}${EOL}${EOL}${rollText}${EOL}${buffText}`;
};

router.post('/', (req: Request, res: Response) => {
  try {
    console.log('/d20');
    const { body } = req;
    const { response_url, user_name, text } = body;

    const flags = text.split(' ');
    const options = getOptionsFromFlags(flags);

    const answer = get1d20(options);
    const output = getResponseText(user_name, answer);

    const responseBody = {
      response_type: 'in_channel',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `${output}`,
          },
        },
      ],
    };

    sendDelayedResponse({
      res,
      response_url,
      responseBody,
      showOriginalMessage: true,
    });
  } catch (e) {
    console.error('an error occurred');
    console.error(e);
    res.status(500).send('error');
  }
});

export default router;

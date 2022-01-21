import { randInt } from './../../util';

const adverbs = [
  '',
  '',
  '',
  'gently ',
  'violently ',
  'carelessly ',
  'carefully ',
  'knowingly ',
];
const verbs = [
  'shakes',
  'caresses',
  'rubs',
  'rolls',
  'tosses',
  'juggles',
  'looks at',
  'peers into',
];

const getShakeText = (user_name: string, text: string): string => {
  const adverb = adverbs[randInt(0, adverbs.length - 1)];
  const verb = verbs[randInt(0, verbs.length - 1)];
  return `${user_name} ${adverb}${verb} the soul sphere and asks "${text}"`;
};

export default getShakeText;

import { getRandItem } from './../../util';

const adverbs: Array<string> = [
  '',
  '',
  '',
  'gently ',
  'violently ',
  'carelessly ',
  'carefully ',
  'knowingly ',
];
const verbs: Array<string> = [
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
  const adverb = getRandItem(adverbs);
  const verb = getRandItem(verbs);
  return `${user_name} ${adverb}${verb} the soul sphere and asks "${text}"`;
};

export default getShakeText;

export const randInt = (min: number, max: number): number => {
  const cmin = Math.ceil(min);
  const fmax = Math.floor(max);
  return Math.floor(Math.random() * (fmax - cmin + 1) + cmin);
};

export const getRandItem = (arr: Array<any>): any => {
  return arr[randInt(0, arr.length - 1)];
};

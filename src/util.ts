export const randInt = (min: number, max: number) => {
  const cmin = Math.ceil(min);
  const fmax = Math.floor(max);
  return Math.floor(Math.random() * (fmax - cmin + 1) + cmin);
};

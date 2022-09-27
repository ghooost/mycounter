export const makeRandomStr = (len = 9) => {
  const ret: string[] = [];
  for (let cnt = 0; cnt < len; cnt++) {
    ret[cnt] = (Math.floor(Math.random() * 1000) % 10) + '';
  }
  return ret.join('');
};

import { makeRandomStr } from './random';

describe('Utils/random', () => {
  test('default length should be 9', () => {
    const str = makeRandomStr();
    expect(str.length).toBe(9);
  });
  test('custom string length 10', () => {
    const str = makeRandomStr(10);
    expect(str.length).toBe(10);
  });
  test('custom string length 2', () => {
    const str = makeRandomStr(2);
    expect(str.length).toBe(2);
  });
  test('random strings should be different', () => {
    const numOfAttempts = 100;
    const dict = new Set<string>();
    for (let cnt = 0; cnt < numOfAttempts; cnt++) {
      dict.add(makeRandomStr());
    }
    expect(dict.size).toBeGreaterThan(numOfAttempts / 2);
  });
});

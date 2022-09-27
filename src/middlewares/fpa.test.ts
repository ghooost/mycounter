import {
  createFpa,
  fpaMiddleware,
  isValidTime,
  lifespan,
  readFpa,
} from './fpa';
import { Request, Response } from '../utils/pipeline';

const mockStorage: Record<string, string> = {};
jest.mock('../utils/storage', () => {
  return {
    __esModule: true,
    getVal: (key: string) => mockStorage[key],
    saveVal: () => true,
  };
});
jest.mock('../utils/random', () => {
  return {
    __esModule: true,
    makeRandomStr: () => 'random',
  };
});
jest.mock('../utils/window', () => {
  return {
    __esModule: true,
    getTimestamp: () => 10,
  };
});

describe('Middlewares/fpa', () => {
  beforeEach(() => {
    mockStorage.fpa = 'fpa';
    mockStorage.fpaLive = '1';
  });
  test('isValidTime', () => {
    expect(isValidTime(0, lifespan)).toBeFalsy();
    expect(isValidTime(0, lifespan - 10)).toBeTruthy();
  });
  test('readFpa', () => {
    expect(readFpa(10)).toBe('fpa');
    expect(readFpa(lifespan + 1)).toBe('');
    delete mockStorage['fpa'];
    expect(readFpa(10)).toBe('');
  });
  test('createFpa', () => {
    expect(createFpa(10)).toBe('P0-random-10');
  });
  test('fpaMiddleware', () => {
    const req: Request = {
      url: '',
      payload: {},
    };
    const resp: Response = {
      payload: {},
      errors: [],
      responseCode: 0,
    };
    const nextFn = jest.fn();
    fpaMiddleware(req, resp, nextFn);
    expect(nextFn.mock.calls.length).toBe(1);
    expect(req.payload).toHaveProperty('fpa', 'fpa');
    expect(req.payload).toHaveProperty('fpan', '1');
  });
});

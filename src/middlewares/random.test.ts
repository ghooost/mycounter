import { Request, Response } from '../utils/pipeline';
import { randomMiddleware } from './random';

jest.mock('../utils/random', () => {
  return {
    __esModule: true,
    makeRandomStr: () => 'random',
  };
});

describe('Middlewares/random', () => {
  test('randomMiddleware', () => {
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
    randomMiddleware(req, resp, nextFn);
    expect(nextFn.mock.calls.length).toBe(1);
    expect(req.payload).toHaveProperty('r', 'random');
  });
});

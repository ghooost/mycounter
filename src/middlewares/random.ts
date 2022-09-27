import { Middleware } from '.';
import { makeRandomStr } from '../utils/random';

export const randomMiddleware: Middleware = (request, response, nextFn) => {
  try {
    request.payload.r = makeRandomStr();
  } catch (err) {
    response.errors.push(err.message);
  }
  nextFn(request, response);
};

import { NextFn, Request, Response } from '../utils/pipeline';

export type Middleware = (
  request: Request,
  response: Response,
  nextFn: NextFn,
) => void;

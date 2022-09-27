import { NextFn, Request, Response } from '../utils/pipeline';

export type Transport = (
  request: Request,
  response: Response,
  nextFn: NextFn,
) => void;

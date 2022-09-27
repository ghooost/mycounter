import { Middleware } from '../middlewares';
import { Transport } from '../transports';

export type Payload = Record<string, string>;
export type URL = string;

export type ErrorData = string;

export type Request = {
  url: URL;
  payload: Payload;
};

export type Response = {
  responseCode: number;
  payload: Payload;
  errors: ErrorData[];
};

export type NextFn = (
  request: Request,
  response: Response,
  errorData?: ErrorData,
) => void;

export const createPipeline = (
  beforeSendMiddlewares: Middleware[],
  transports: Transport[],
) => {
  const onSendindError = () => {
    // do something if we can't send data
  };
  const finalSend = transports.reduceRight(
    (nextFn: NextFn, transport): NextFn =>
      (request: Request, response: Response) => {
        transport(request, response, nextFn);
      },
    onSendindError,
  );

  const nextBefore = beforeSendMiddlewares.reduceRight(
    (nextFn: NextFn, middleware): NextFn =>
      (request: Request, response: Response) => {
        middleware(request, response, nextFn);
      },
    finalSend,
  );

  return (url: URL, payload: Payload) => {
    const request: Request = {
      url,
      payload: { ...payload },
    };
    const response: Response = {
      responseCode: 0,
      payload: {},
      errors: [],
    };
    nextBefore(request, response);
  };
};

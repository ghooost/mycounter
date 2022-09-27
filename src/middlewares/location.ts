import { Middleware } from '.';
import { makeRandomStr } from '../utils/random';

const requestId = 'locationReq';
const responseId = 'locationRes';
const timeout = 1000;

type MessageRequest = {
  id: string;
  key: string;
  url?: string;
  ref?: string;
};

export const receiver = (evt: MessageEvent<MessageRequest>) => {
  const { id, key } = evt.data;
  if (id !== requestId) {
    return;
  }
  const win = evt.source as Window;
  win?.postMessage(
    {
      id: responseId,
      key,
      url: location.href,
      ref: document.referrer,
    },
    '*',
  );
};

window.addEventListener('message', receiver, false);

export const locationMiddleware: Middleware = (request, response, nextFn) => {
  try {
    request.payload.url = window.top.location.href;
    request.payload.ref = window.top.document.referrer;
    nextFn(request, response);
  } catch (_) {
    let localKey = makeRandomStr();
    const timer = setTimeout(() => {
      response.errors.push('locationMiddleware: timeout');
      localKey = '';
      nextFn(request, response);
    }, timeout);
    const catcher = (evt: MessageEvent<MessageRequest>) => {
      const { id, key, url, ref } = evt.data;
      if (id === responseId && key === localKey) {
        request.payload.ref = ref;
        request.payload.url = url;
        clearTimeout(timer);
        nextFn(request, response);
      }
    };
    window.addEventListener('message', catcher, false);
    window.top.postMessage({ id: requestId, key: localKey }, '*');
  }
};

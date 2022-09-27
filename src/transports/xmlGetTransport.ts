import { Transport } from '.';
import { getXMLHttpRequest } from '../utils/window';

export const xmlGetTransport: Transport = (request, response, onError) => {
  const req = getXMLHttpRequest();
  const listener = () => {
    if (req.status !== 200) {
      response.errors.push(req.statusText);
      return onError(request, response);
    }
  };

  const params: string[] = [];
  for (const key in request.payload) {
    if (request.payload.hasOwnProperty(key)) {
      params.push(`${key}=${encodeURIComponent(request.payload[key])}`);
    }
  }
  const url = request.url + (params.length ? '?' : '') + params.join('&');
  req.addEventListener('load', listener);
  req.addEventListener('error', listener);
  req.open('GET', url);
  req.send();
};

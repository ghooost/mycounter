import { Middleware } from '.';
import { makeRandomStr } from '../utils/random';
import { getVal, saveVal } from '../utils/storage';
import { getTimestamp } from '../utils/window';

const varName = 'fpa';
const timeName = 'fpaLive';
export const lifespan = 13 * 30 * 24 * 3600000;

export const isValidTime = (timeMin: number, timeMax: number) => {
  return timeMax - timeMin < lifespan;
};

export function readFpa(time: number) {
  const fpaStored = getVal(varName);
  const timeStored = parseInt(getVal(timeName) ?? '0');
  if (!fpaStored || !timeStored || !isValidTime(timeStored, time)) {
    return '';
  }
  return fpaStored;
}

export function createFpa(time: number) {
  const fpa = ['P0', makeRandomStr(10), time + ''].join('-');
  saveVal(varName, fpa);
  saveVal(timeName, time + '');
  return fpa;
}

export const fpaMiddleware: Middleware = (request, response, nextFn) => {
  try {
    const time = getTimestamp();
    const fpa = readFpa(time);
    request.payload.fpa = fpa || createFpa(time);
    request.payload.fpan = fpa ? '1' : '0';
  } catch (err) {
    response.errors.push(err.message);
  }
  nextFn(request, response);
};

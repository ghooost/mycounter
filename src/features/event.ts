import { fpaMiddleware } from '../middlewares/fpa';
import { locationMiddleware } from '../middlewares/location';
import { randomMiddleware } from '../middlewares/random';
import { xmlGetTransport } from '../transports/xmlGetTransport';
import { createPipeline } from '../utils/pipeline';
import { getWindow } from '../utils/window';

type EventData = {
  account: string;
  labels: string;
};
export interface WindowEvented {
  events?: EventData[];
}

const url = 'https://pixel.quantserve.com/pixel';

export const eventListener = () => {
  const pipeline = createPipeline(
    [randomMiddleware, fpaMiddleware, locationMiddleware],
    [xmlGetTransport],
  );
  const win = getWindow() as WindowEvented;
  const events = win.events;
  if (events) {
    const origin = events.push;
    const pipelineStart = (event: EventData) => {
      pipeline(url, {
        a: 'p-' + event['account'],
        labels: event['labels'],
      });
    };
    events.push = function (event: EventData) {
      const len = origin.apply(events, [event]);
      pipelineStart(event);
      return len;
    };
    for (let cnt = 0; cnt < events.length; cnt++) {
      pipelineStart(events[cnt]);
    }
  }
};

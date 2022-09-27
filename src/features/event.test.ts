import { eventListener, WindowEvented } from './event';

const mockWindow: WindowEvented = {
  events: [
    {
      account: 'account',
      labels: 'labels',
    },
  ],
};
jest.mock('../utils/window', () => {
  return {
    __esModule: true,
    getWindow: jest.fn(() => mockWindow),
  };
});
const mockPipeline = jest.fn();
jest.mock('../utils/pipeline', () => {
  return {
    __esModule: true,
    createPipeline: () => mockPipeline,
  };
});

describe('Features/event', () => {
  test('calls pipeline with right params', () => {
    eventListener();
    expect(mockPipeline.mock.calls.length).toBe(1);
    expect(mockPipeline.mock.calls[0][0]).toBe(
      'https://pixel.quantserve.com/pixel',
    );
    expect(mockPipeline.mock.calls[0][1]).toHaveProperty('a', 'p-account');
    expect(mockPipeline.mock.calls[0][1]).toHaveProperty('labels', 'labels');
  });
});

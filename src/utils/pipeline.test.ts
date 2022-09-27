import { createPipeline } from './pipeline';

describe('Utils/pipeline', () => {
  const mockMiddlewareA = jest.fn((request, response, nextFn) => {
    request.payload['dataA'] = 'on';
    nextFn(request, response);
  });
  const mockMiddlewareB = jest.fn((request, response, nextFn) => {
    request.payload['dataB'] = 'on';
    nextFn(request, response);
  });
  const mockTransportErr = jest.fn((request, response, nextFn) => {
    nextFn(request, response);
  });
  const mockTransportOk = jest.fn();

  beforeEach(() => {
    mockMiddlewareA.mockClear();
    mockMiddlewareB.mockClear();
    mockTransportErr.mockClear();
    mockTransportOk.mockClear();
  });
  test('should call all middlewares', () => {
    const pipeline = createPipeline([mockMiddlewareA, mockMiddlewareB], []);
    const data = { dataInit: 'on' };
    pipeline('testurl', data);
    expect(mockMiddlewareA.mock.calls.length).toBe(1);
    expect(mockMiddlewareB.mock.calls.length).toBe(1);
  });
  test('should transfer data', () => {
    const pipeline = createPipeline(
      [mockMiddlewareA, mockMiddlewareB],
      [mockTransportOk],
    );
    const data = { dataInit: 'on' };
    pipeline('testurl', data);
    expect(mockMiddlewareA.mock.calls[0][0].payload).toHaveProperty(
      'dataInit',
      'on',
    );
    expect(mockMiddlewareB.mock.calls[0][0].payload).toHaveProperty(
      'dataA',
      'on',
    );
    expect(mockTransportOk.mock.calls[0][0].payload).toHaveProperty(
      'dataB',
      'on',
    );
  });
  test('should iterate transports', () => {
    const pipeline = createPipeline(
      [],
      [mockTransportErr, mockTransportErr, mockTransportOk],
    );
    const data = { dataInit: 'on' };
    pipeline('testurl', data);
    expect(mockTransportOk.mock.calls.length).toBe(1);
    expect(mockTransportErr.mock.calls.length).toBe(2);
  });
  test('should stop transports iteration at Ok transport', () => {
    const pipeline = createPipeline(
      [],
      [mockTransportErr, mockTransportOk, mockTransportErr],
    );
    const data = { dataInit: 'on' };
    pipeline('testurl', data);
    expect(mockTransportOk.mock.calls.length).toBe(1);
    expect(mockTransportErr.mock.calls.length).toBe(1);
  });
});

import { xmlGetTransport } from './xmlGetTransport';

const mockXhr = {
  status: 200,
  statusText: 'some text',
  open: jest.fn(),
  send: jest.fn(),
  addEventListener: jest.fn(),
};
jest.mock('../utils/window', () => {
  const originalModule = jest.requireActual('../utils/window');
  return {
    __esModule: true,
    ...originalModule,
    getXMLHttpRequest: jest.fn(() => mockXhr),
  };
});
const mockNextFn = jest.fn();

describe('Transports/xmlGetTransport', () => {
  beforeEach(() => {
    mockXhr.status = 200;
    mockXhr.statusText = 'some text';
    mockXhr.open.mockClear();
    mockXhr.send.mockClear();
    mockXhr.addEventListener.mockClear();
    mockNextFn.mockClear();
  });
  test('calls all methods', () => {
    xmlGetTransport(
      {
        url: 'testurl',
        payload: { field1: '1', field2: '2' },
      },
      {
        responseCode: 0,
        errors: [],
        payload: {},
      },
      mockNextFn,
    );
    expect(mockXhr.open.mock.calls.length).toBe(1);
    expect(mockXhr.send.mock.calls.length).toBe(1);
    expect(mockXhr.addEventListener.mock.calls.length).toBe(2);
  });

  test('form right URL', () => {
    xmlGetTransport(
      {
        url: 'testurl',
        payload: { field1: '1', field2: '2' },
      },
      {
        responseCode: 0,
        errors: [],
        payload: {},
      },
      mockNextFn,
    );
    expect(mockXhr.open.mock.calls[0][0]).toBe('GET');
    expect(mockXhr.open.mock.calls[0][1]).toBe('testurl?field1=1&field2=2');
  });

  test('calls nextFn on error', () => {
    xmlGetTransport(
      {
        url: 'testurl',
        payload: {},
      },
      {
        responseCode: 0,
        errors: [],
        payload: {},
      },
      mockNextFn,
    );
    mockXhr.status = 404;
    mockXhr.statusText = 'Page not found';
    mockXhr.addEventListener.mock.calls[0][1]();

    expect(mockNextFn.mock.calls.length).toBe(1);
    const errors = mockNextFn.mock.calls[0][1].errors;
    expect(errors.length).toBe(1);
    expect(errors[0]).toBe('Page not found');
  });

  test('doesnt call nextFn on success', () => {
    xmlGetTransport(
      {
        url: 'testurl',
        payload: {},
      },
      {
        responseCode: 0,
        errors: [],
        payload: {},
      },
      mockNextFn,
    );
    mockXhr.status = 200;
    mockXhr.addEventListener.mock.calls[0][1]();
    expect(mockNextFn.mock.calls.length).toBe(0);
  });
});

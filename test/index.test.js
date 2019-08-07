const MultiEvent = require('../dist/event.js');

describe('test multi-event', () => {
  let event;
  beforeEach(() => {
    event = new MultiEvent();
  })

  test('test addEventListener', () => {
    const mockCallback_A = jest.fn();
    const res_A = event.on('event1', mockCallback_A);
    event.emit('event1', 'aaa');
    expect(mockCallback_A.mock.calls[ 0 ][ 0 ]).toBe('aaa');
    expect(res_A.toString()).toBe('Symbol(event1)');

    const mockCallback_B = jest.fn();
    const res_B = event.on([ 'event1', 'event2' ], mockCallback_B);
    event.emit('event1', 'bbb');
    event.emit('event2', 'bbb');
    expect(mockCallback_A.mock.calls.length).toBe(2);
    expect(mockCallback_B.mock.calls.length).toBe(2);
    expect(res_B.event1.toString()).toBe('Symbol(event1)');
    expect(res_B.event2.toString()).toBe('Symbol(event2)');

    const mockCallback_C = jest.fn();
    event.on([ 'event3', 'event4' ], [
      mockCallback_B,
      mockCallback_C,
    ]);
    event.emit('event3', 'ccc');
    event.emit('event4', 'ddd');
    expect(mockCallback_B.mock.calls[2][0]).toBe('ccc');
    expect(mockCallback_B.mock.calls[3][0]).toBe('ddd');
    expect(mockCallback_C.mock.calls[0][0]).toBe('ccc');
    expect(mockCallback_C.mock.calls[1][0]).toBe('ddd');
  });

  test('test emit event', () => {
    const mockCallback_A = jest.fn();
    const mockCallback_B = jest.fn();
    event.on([ 'event1', 'event2' ], [
      mockCallback_A,
      mockCallback_B,
    ]);
    event.emit('event1');
    expect(mockCallback_A.mock.calls.length).toBe(1);
    expect(mockCallback_B.mock.calls.length).toBe(1);
    event.emit([ 'event1' ]);
    expect(mockCallback_A.mock.calls.length).toBe(2);
    expect(mockCallback_B.mock.calls.length).toBe(2);
    event.emit([ 'event1', 'event2' ], 'aaa', 'bbb');
    expect(mockCallback_A.mock.calls.length).toBe(4);
    expect(mockCallback_B.mock.calls.length).toBe(4);
    expect(mockCallback_A.mock.calls[2]).toEqual(['aaa', 'bbb']);
    expect(mockCallback_A.mock.calls[3]).toEqual(['aaa', 'bbb']);
    expect(mockCallback_B.mock.calls[2]).toEqual(['aaa', 'bbb']);
    expect(mockCallback_B.mock.calls[3]).toEqual(['aaa', 'bbb']);
  })

  test('test remove event function', () => {
    const mockCallback_A = jest.fn();
    const mockCallback_B = jest.fn();
    const res = event.on([ 'event1', 'event2' ], [
      mockCallback_A,
      mockCallback_B,
    ]);
    console.log(res);
  })
});

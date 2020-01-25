const MultiEvent = require('../lib/event.ts');

describe('test multi-event', () => {
  let event;
  let mockCallback_A;
  let mockCallback_B;
  beforeEach(() => {
    event = new MultiEvent();
    mockCallback_A = jest.fn();
    mockCallback_B = jest.fn();
  })
  test('test addEventListener', () => {
    const res_A = event.on('event1', mockCallback_A);
    event.emit('event1', 'aaa');
    expect(mockCallback_A.mock.calls[ 0 ][ 0 ]).toBe('aaa');
    expect(res_A.toString()).toBe('Symbol(event1)');

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
    function wrongFunction() {
      event.on('event3', [ 'not function' ])
    }
    expect(wrongFunction).toThrow('single callback parameter type error:not function');
  })

  test('test once emit event', () => {
    event.once([ 'event1', 'event2' ], [
      mockCallback_A,
      mockCallback_B,
    ]);
    event.emit('event1');
    expect(event.event1).toBeUndefined();
    expect(mockCallback_A.mock.calls.length).toBe(1);
  })

  test('test remove event function', () => {
    const onRes_A = event.on([ 'event1', 'event2' ], [
      mockCallback_A,
      mockCallback_B,
    ]);
    const remove_A = event.removeEventFunction(onRes_A);
    expect(event._events.size).toBe(0);
    expect(event._eventsCount).toBe(0);
    expect(remove_A).toEqual([true, true]);
    const onRes_B = event.on([ 'event1', 'event2' ], mockCallback_A);
    const remove_B = event.removeEventFunction([ onRes_B.event1, onRes_B.event2 ]);
    expect(event._eventsCount).toBe(0);
    expect(remove_B).toEqual([true, true]);
    const onRes_C = event.on('event1', mockCallback_A);
    const onRes_D = event.on('event2', mockCallback_B);
    const remove_C = event.removeEventFunction(onRes_C);
    const remove_D = event.removeEventFunction([ onRes_D, 'NO_NAME' ]);
    expect(remove_C).toBe(true);
    expect(remove_D).toEqual([ true, false ]);
    const onRes_E = event.on([ 'event1', 'event2' ], mockCallback_A);
    const onRes_F = event.on('event4', mockCallback_A);
    const remove_E = event.removeEventFunction([ onRes_F, onRes_E.event1, 'string' ]);
    expect(remove_E).toEqual([ true, true, false ]);
    expect(event._events.get('event2')).toBeDefined();
    expect(event._eventsCount).toBe(1);
    const remove_F = event.removeEventFunction(onRes_E);
    expect(remove_F).toEqual([ false, true ]);
    expect(event._eventsCount).toBe(0);
  })

  test('test remove all subscription in the event name', () => {
    event.on([ 'event1', 'event2', 'event3' ], [
      mockCallback_A,
      mockCallback_B,
    ]);
    const remove_A = event.removeEvent('event1');
    expect(event.event1).toBeUndefined();
    expect(remove_A).toBe(true);
    const remove_B = event.removeEvent(['event2','false']);
    expect(event.event2).toBeUndefined();
    expect(remove_B).toEqual([true, false]);
  })

  test('test trigger and remove hook', () => {
    const onRes_A = event.on([ 'event1', 'event2' ], () => {});
    event.on('trigger', mockCallback_A)
    event.emit([ 'event1', 'event2' ], 'paramsA', 'paramsB')
    expect(mockCallback_A.mock.calls.length).toBe(2);
    expect(mockCallback_A.mock.calls).toEqual([[ 'event1', [ 'paramsA', 'paramsB' ] ],[ 'event2', [ 'paramsA', 'paramsB' ] ]]);

    event.on('remove', mockCallback_B);
    event.removeEvent('event1');
    expect(mockCallback_B.mock.calls).toEqual([[ 'event1', []]]);
    event.removeEventFunction(onRes_A);
    expect(mockCallback_B.mock.calls).toEqual([[ 'event1', []], [ 'event2', []]]);
  })
});

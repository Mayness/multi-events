const MultiEvent = require('../dist/multi-events.js');

describe('test multi-event', () => {
  const event = new MultiEvent();

  test('test', () => {
    event.on('event1', [
      val => {
        console.log(val)
      }
    ])
    event.emit('event1');
  });
});

const MultiEvent = require('../lib/event.ts');
const event = new MultiEvent();

event.on('event1', [
  val => {
    console.log(val)
  }
])
event.emit('event1');
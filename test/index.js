const MultiEvent = require('../lib/event.ts');
const event = new MultiEvent();

event.once(['event1', 'event2'], val => {
  // console.log(val);
})
event.emit('event1');
console.log(event);
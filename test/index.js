const EasyEvent = require('../dist/event.js');

const event = new EasyEvent();

const test = function () {
  event.on('test', function() {
    console.log(this);
  })
}.bind({
  a: 1
})

test();

event.emit('test', 22)
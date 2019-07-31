const EasyEvent = require('../lib/event.ts');

const event = new EasyEvent();

const test = function () {
  const cache = event.on([ 'test', 'test2' ], [
    function(val, key) {
      console.log('11111');
      console.log(key);
    },
    function(val, key) {
      console.log(key, '要被删掉');
    },
  ]);
  const cache1 = event.on('test2', [
    function(val, key) {
      console.log('3333');
      console.log(key);
    },
  ]);
  event.removeEventFunction([ cache1 ]);
}.bind({
  a: 1
})

test();
event.emit([ 'test', 'test2' ], 22)
event.emit('test2', 555)
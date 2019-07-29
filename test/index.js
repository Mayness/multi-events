const EasyEvent = require('../lib/event.ts');

const event = new EasyEvent();

const test = function () {
  const cache = event.on([ 'test', 'test2' ], [
    function(val) {
      console.log('11111');
      console.log(val);
    },
    function(val) {
      console.log('22222');
      console.log(val);
    },
  ]);
  console.log(cache);
  // event.on('test2', [
  //   function(val) {
  //     console.log('3333');
  //     console.log(val);
  //   },
  // ])
}.bind({
  a: 1
})

test();

event.emit([ 'test', 'test2' ], 22)
event.emit('test2', 555)
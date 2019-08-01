const EasyEvent = require('../lib/event.ts');

const event = new EasyEvent();

const test = function () {
  // const cache2 = event.on('newEventListener', function(key) {
  //   // console.log('4444');
  //   console.log(key);
  // });
  // const cache = event.on([ 'test', 'test2' ], [
  //   function(val, key) {
  //     // console.log('11111');
  //     console.log(val);
  //   },
  //   function(val, key) {
  //     console.log(val, '要被删掉');
  //   },
  // ]);
  // const cache1 = event.on('test2', [
  //   function(val, key) {
  //     // console.log('3333');
  //     console.log(val);
  //   },
  // ]);
  const cache1 = event.once('test3', function(val) {
    console.log('5555');
    console.log(val);
  },);
  // console.log(event.removeEvent([ 'test2', cache2 ]));
  // console.log(event.removeEventFunction(cache));
}.bind({
  a: 1
})

test();
event.emit([ 'test', 'test2' ], 22)
event.emit('test2', 555)
event.emit('test3', 'once123')
# multi-events

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]

[npm-image]: https://img.shields.io/npm/v/multi-events.svg?style=flat-square
[npm-url]: https://npmjs.org/package/multi-events
[travis-image]: https://img.shields.io/travis/Mayness/multi-events.svg
[travis-url]: https://travis-ci.org/Mayness/multi-events
[codecov-image]: https://img.shields.io/codecov/c/github/Mayness/multi-events.svg?style=flat-square
[codecov-url]: https://codecov.io/github/Mayness/multi-events?branch=master


触发多个事件  
event.emit(event, params)  
event.emit([ 'event1', 'event2' ], params)  

监听多个事件、监听触发多个方法，返回当前监听id，用于卸载  
const id1 = event.on([ 'event1', 'event2' ], fn); // { event1: Symbol(event1), event2: Symbol(event2) }  
const id2 = event.on('event1', [fn1, fn2]); // Symbol(event1);  
const id3 = event.on([ 'event1', 'event2' ], [fn1, fn2]); // {   event1: Symbol(event1), event2: Symbol(event2) }  
const id4;

卸载监听事件  
event.removeEvent('event');  // true or false
event.removeEvent([ 'event1', 'event2' ]);  // [ true, true ]

卸载触发方法  
event.removeEventFunction(id1);  // 移除整个id1.event1、id1.event2监听事件  返回[ true, true ]，内部会解析为event.removeEventFunction([ id1.event1, id1.event2 ])  
event.removeEventFunction([ id1 ]);  // 返回[ true, true ]，和上面表示一致  
event.removeEventFunction([ id1, id2, 'undefined' ]);  // 返回[ true, true, false ]  
event.removeEventFunction([ id1.event1, id2 ]);  // 只用传id2即可，因为本身就是symbol类型，返回 [ true, true ]  
event.removeEventFunction([ id1.event1, id3.event1 ]);  // 返回[ true, true ]  

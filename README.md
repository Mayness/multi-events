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

# 简介
用来处理多个订阅事件和方法的订阅发布模块

# 安装
npm -S install multi-events

[![NPM](https://nodei.co/npm/multi-events.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/multi-events/)


# 用法
## 初始化
```javascript
const MultiEvent = require('multi-events');

const event = new MultiEvent();
```

## emit 
触发单个或多个订阅事件  
第一个参数是订阅事件名，当是多个事件订阅时，可以传入数组。  
```javascript
event.emit(event, params)  
event.emit([ 'event1', 'event2' ], params)  
```

## on
订阅多个事件、监听触发多个方法，返回当前监听id，用于卸载方法。  
注意，传入是单个订阅事件时，返回的是个Symbol对象；当传入多个订阅事件，返回的则是个对象。
```javascript
const id1 = event.on([ 'event1', 'event2' ], fn); // 返回 { event1: Symbol(event1), event2: Symbol(event2) }  

const id2 = event.on('event1', [fn1, fn2]); // Symbol(event1);  

const id3 = event.on([ 'event1', 'event2' ], [fn1, fn2]); // {   event1: Symbol(event1), event2: Symbol(event2) }  
```

## once
订阅事件只会触发一次就会被移除，后面再次emit将不再触发
具体使用方法和on方法一致  

## removeEvent
卸载当前订阅事件的所有方法，传入订阅事件名  
如果仅仅是需要移除某个方法时候，可以考虑用<a href="#removeeventfunction ">removeEventFunction</a>方法  

```javascript
event.removeEvent('event');  // true or false  
event.removeEvent([ 'event1', 'event2' ]);  // [ true, true ]  
```

## removeEventFunction  
卸载单个订阅的方法，传入订阅事件的唯一id  
在用于卸载的方法时候，需要用到on方法的返回值，虽然它会返回单个symbol或object类型，但是如果仅仅是需要移除当前on的订阅事件的话，直接将它传入该方法即可，不用关心它的类型
```javascript
event.removeEventFunction(id1);  // 移除整个id1.event1、id1.event2监听事件  返回[ true, true ]，内部会解析为event.removeEventFunction([ id1.event1, id1.event2 ])  
event.removeEventFunction([ id1 ]);  // 返回[ true, true ]，和上面表示一致  
event.removeEventFunction([ id1, id2, 'undefined' ]);  // 返回[ true, true, false ]  
event.removeEventFunction([ id1.event1, id2 ]);  // 只用传id2即可，因为本身就是symbol类型，返回 [ true, true ]  
event.removeEventFunction([ id1.event1, id3.event1 ]);  // 返回[ true, true ]  
```

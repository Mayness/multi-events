# multi-events

触发多个事件  
event.emit(event, params)  
event.emit([ 'event1', 'event2' ], params)  

监听多个事件、监听触发多个方法，返回当前监听id，用于卸载  
const id1 = event.on([ 'event1', 'event2' ], fn); // { event1: Symbol(event1), event2: Symbol(event2) }  
const id2 = event.on('event1', [fn1, fn2]); // Symbol(event1);  
const id3 = event.on([ 'event1', 'event2' ], [fn1, fn2]); // {   event1: Symbol(event1), event2: Symbol(event2) }  

卸载监听事件  
event.removeEvent('event');  
event.removeEvent([ 'event1', 'event2' ]);  

卸载触发方法  
event.removeEventFunction(id);  
event.removeEventFunction([ id1, id2 ]);  
event.removeEventFunction([ id1.event1, id2 ]);  // 只用传id2即可，因为本身就是symbol类型  
event.removeEventFunction([ id1.event1, id3.event1 ]);  
event.removeEventFunction(id1); // 移除整个id1.event1、id1.event2监听事件  
event.removeEventFunction(id2);  

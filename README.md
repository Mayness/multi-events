# easy-events

提供卸载方法
const e = event.on('event', fn);
e();  // 卸载方法

触发多个事件
event.emit([ 'event1', 'event2' ], params)

监听多个事件
event.on([ 'event1', 'event2' ], fn);

卸载监听事件
event.removeEvent([ 'event1', 'event2' ]);

卸载触发方法
event.removeEventFunction([ e, ... ]);

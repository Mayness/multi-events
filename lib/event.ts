interface EventCache {
  [propName: string]: Symbol;
}

interface _events {
  [propName: string]: Array<{
    fn: Array<Function>;
    id: Symbol;
  }>;
}

interface MultiEvents {
  _events: _events;
  _eventsCount: number;
  constructor(): void;
  on(eventName: Array<string>, callback: Array<Function>): EventCache;
  emit(eventName: Array<string>, ...arg: Array<any>): void;
  removeEvent(eventArray: Array<string>): Array<boolean> | boolean;
  removeEventFunction(id: Array<Symbol>): Array<boolean> | boolean;
}

function onEventCheck(target: MultiEvents, key: string, descriptor: PropertyDescriptor): PropertyDescriptor {
  const fn = descriptor.value;
  descriptor.value = function(eventName: Array<string> | string, callback: Array<Function> | Function) {
    if (callback) {
      if (typeof callback === 'function') {
        callback = [callback];
      } else if (Array.isArray(callback)) {
        callback.forEach(fn => {
          if (typeof fn !== 'function') {
            throw Error('parameter Error');
          }
        });
      } else {
        throw Error('parameter Error');
      }
    } else {
      throw Error('Missing necessary parameters');
    }
    arguments[0] = Array.isArray(eventName) ? Array.from(new Set(eventName)) : [eventName];
    return Reflect.apply(fn, this, arguments);
  };
  return descriptor;
}

/**
 * @description: 通用格式化传入参数方法
 * @param {boolean} disRepeat 为指定参数去重去重，默认true
 * @param {number} index 需要格式化参数的小标，默认是第一个参数
 * @return {MethodDecorator} 方法装饰器，内部触发格式化后的参数
 */
function formatReq(disRepeat: boolean = true, index: number = 0): MethodDecorator {
  return function(target: MultiEvents, key: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const fn = descriptor.value;
    descriptor.value = function() {
      const param = arguments[index];
      if (typeof param === 'string') {
        arguments[0] = [param];
      } else if (Array.isArray(param)) {
        if (disRepeat) {
          arguments[0] = Array.from(new Set(param));
        }
      } else {
        throw Error('parameter Error');
      }
      return Reflect.apply(fn, this, arguments);
    };
    return descriptor;
  };
}

/**
 * @description: 通用格式化返回参数，传入事件是什么格式就返回什么格式
 * @param {Array} data
 * @return:
 */
enum resType {
  object,
  array
}
function formatRes(type: resType = resType.array, index: number = 0): MethodDecorator {
  return function(target: MultiEvents, key: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const fn = descriptor.value;
    descriptor.value = function() {
      const value = arguments[index];
      const data = Reflect.apply(fn, this, arguments);
      // 传入参数为Array，返回String 或者 传入参数数为Object，返回Symbol，则结果就只返回第1位，反之则全返回
      const flag:boolean = type === resType.array && getType<String>(value, 'String') || type === resType.object && getType<Symbol>(value, 'Symbol')
      return flag ? data[ 0 ] : data;
    };
    return descriptor;
  };
}

type idType = Array<Symbol> | EventCache | Symbol;
/**
 * 移除事件方法
 * @param {idType} ids
 * const cache1 = event.on(['test1', 'test2'], fn)
 * const cache2 = event.on(test1, fn)
 */
function removeEventFunctionCheck(target: MultiEvents, key: string, descriptor: PropertyDescriptor): PropertyDescriptor {
  const fn = descriptor.value;
  descriptor.value = function(ids: idType) {
    const arr = deepObjectToArray(ids);
    if (arr.length) {
      return Reflect.apply(fn, this, [arr]);
    } else {
      throw Error('parameter Error');
    }
  };
  return descriptor;
}

function getSymbolDes(symbol: Symbol): string {
  return symbol ? (symbol.description ? symbol.description : symbol.toString().replace(/^Symbol\((\S+)\)$/g, '$1')) : '';
}

function getType<T>(s: any, type: string): s is T {
  return Object.prototype.toString.call(s).replace(/^\[object (\S+)\]/g, '$1') === type;
}

/**
 * @description: 转换参数 [{prop: Symbol}]、{prop:Symbol}、Symbol => [ Symbol ]
 * @param {idType}
 * @return {Array<Symbol>}
 */
function deepObjectToArray(value: any): Array<Symbol> {
  let arr: Array<Symbol> = [];
  if (getType<Symbol>(value, 'Symbol')) {
    arr = [value];
  } else if (typeof value === 'object') {
    for (let i in value) {
      if (getType<EventCache>(value[i], 'Object')) {
        arr = arr.concat(deepObjectToArray(value[i]));
      } else  {
        arr.push(value[i]);
      }
    }
  }
  return arr;
}

class MultiEvents {
  constructor() {
    this._events = Object.create({});
    this._eventsCount = 0;
  }

  @onEventCheck
  on(eventArray: Array<string>, callback: Array<Function>) {
    this._eventsCount += callback.length * eventArray.length;
    const cache: EventCache = {};
    for (const eventName of eventArray) {
      let fnArray = this._events[eventName] || [];
      const id = Symbol(eventName);
      fnArray.push({
        fn: callback,
        id
      });
      this._events[eventName] = fnArray;
      cache[eventName] = id;
    }
    const s = Object.values(cache);
    return s.length === 1 ? s[0] : cache;
  }

  @formatReq()
  emit(eventArray: Array<string>, ...arg: Array<any>) {
    eventArray.forEach(eventName => {
      const cbList = this._events[eventName];
      if (cbList) {
        cbList.forEach(item => {
          item.fn.forEach(fn => {
            Reflect.apply(fn, this, [...arg, eventName]);
          });
        });
      }
    });
  }

  @formatRes()
  @formatReq(false)
  removeEvent(eventArray: Array<string>) {
    const cache: Array<boolean> = [];
    for (const eventName of eventArray) {
      let flag: boolean = false;
      const fnArray = this._events[eventName];
      if (fnArray) {
        const num = fnArray.reduce((total, curr) => {
          return (total += curr.fn.length);
        }, 0);
        this._eventsCount -= num;
        delete this._events[eventName];
        flag = true;
      }
      cache.push(flag);
    }
    return cache;
  }

  @formatRes(resType.object)
  @removeEventFunctionCheck
  removeEventFunction(ids: Array<Symbol>) {
    const cache: Array<boolean> = [];
    let removeNum: number = 0;
    for (const id of ids) {
      const eventName = getSymbolDes(id);
      const fnArray = this._events[eventName];
      let flag: boolean = false;
      if (fnArray) {
        const nowEventItem = fnArray.filter(item => {
          if (item.id !== id) {
            return true;
          } else {
            flag = true;
            removeNum += item.fn.length;
          }
        });
        if (nowEventItem.length) {
          this._events[eventName] = nowEventItem;
        } else {
          delete this._events[eventName];
        }
        console.log(this._events);
      }
      cache.push(flag);
    }
    this._eventsCount -= removeNum;
    return cache;
  }
}

module.exports = MultiEvents;

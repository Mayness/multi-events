import EventSub from './sub';

interface EventCache {
  [propName: string]: symbol;
}

interface _events {
  [propName: string]: EventSub[];
}

interface MultiEvents {
  _events: _events;
  _eventsCount: number;
  constructor(): void;
  on(eventName: string[], callback: Function[]): EventCache;
  emit(eventName: string[], ...arg: any[]): void;
  once(eventArray: string[], callback: Function[]): EventCache;
  removeEvent(eventArray: string[]): boolean[] | boolean;
  removeEventFunction(id: symbol[]): boolean[] | boolean;
}

interface WrapObj {
  id: symbol;
  cbArray: Function[];
  eventName: string;
}

/** 内部方法解释
 * @description: on方法参数转换，需要同时转换订阅事件和方法
 * @param {string[] | string} eventName 订阅名称，需要转换为数组
 * @param {Function[] | Function} callback 订阅事件，需要转换为数组
 * @return: 改写descriptor
 */
function triggerEventReq(target: MultiEvents, key: string, descriptor: PropertyDescriptor): PropertyDescriptor {
  const fn = descriptor.value;
  descriptor.value = function(eventName: string[] | string, callback: Function[] | Function) {
    if (callback) {
      if (typeof callback === 'function') {
        callback = [callback];
      } else if (Array.isArray(callback)) {
        callback.forEach(fn => {
          if (typeof fn !== 'function') {
            throw Error('single callback parameter type error:' + fn);
          }
        });
      } else {
        throw Error('callback parameter type error:' + callback);
      }
    } else {
      throw Error('Missing necessary parameters');
    }
    const eventArray = Array.isArray(eventName) ? Array.from(new Set(eventName)) : [eventName];
    return Reflect.apply(fn, this, [ eventArray, callback ]);
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
        throw Error('parameter type error:' + param);
      }
      return Reflect.apply(fn, this, arguments);
    };
    return descriptor;
  };
}

/**
 * @description: 通用格式化返回参数，传入参数是什么格式就返回什么格式
 * @param {resType} type 限定传入的数据类型，默认是array
 * @param {number} index 需要格式化参数的小标，默认是第一个参数
 * @return: {MethodDecorator} 方法装饰器，内部触发格式化后的返回值
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
      if (!data) return;
      // 传入参数为Array，返回String 或者 传入参数数为Object，返回Symbol，则结果就只返回第1位（如果结果是对象则返回值的第1位），反之则全返回
      const flag: boolean = (type === resType.array && getType<string>(value, 'String')) || (type === resType.object && getType<symbol>(value, 'Symbol'));
      return flag ? (Array.isArray(data) ? data[0] : Object.values(data)[0]) : data;
    };
    return descriptor;
  };
}

type idType = symbol[] | EventCache | symbol;
/**
 * 移除事件方法
 * @param {idType} ids
 * const cache1 = event.on(['test1', 'test2'], fn)
 * const cache2 = event.on(test1, fn)
 */
function removeEventFunctionCheck(target: MultiEvents, key: string, descriptor: PropertyDescriptor): PropertyDescriptor {
  const fn = descriptor.value;
  descriptor.value = function(ids: idType) {
    const arr = unwrapId(ids);
    if (arr.length) {
      return Reflect.apply(fn, this, [arr]);
    } else {
      throw Error('not fount events id:' + arr);
    }
  };
  return descriptor;
}

/**
 * @description: 获取Symbol名称
 * @param {symbol} symbol symbol唯一标识
 * @return: string
 */
function getSymbolDes(symbol: symbol): string {
  return symbol ? (symbol.description ? symbol.description : symbol.toString().replace(/^Symbol\((\S+)\)$/g, '$1')) : '';
  // return symbol.toString().replace(/^Symbol\((\S+)\)$/g, '$1');
}

/**
 * @description: ts获取类型
 * @param {any} s 判断字段
 * @param {string} type 期望的类型
 * @return: 判断是否是该类型
 */
function getType<T>(s: any, type: string): s is T {
  return Object.prototype.toString.call(s).replace(/^\[object (\S+)\]/g, '$1') === type;
}

/**
 * @description: 转换参数 [{prop: Symbol}]、{prop:Symbol}、Symbol => [ Symbol ]
 * @param {idType} value
 * @return {Symbol[]}
 */

function unwrapId(value: any): symbol[] {
  let arr: symbol[] = [];
  if (getType<symbol>(value, 'Symbol')) {
    arr = [value];
  } else if (typeof value === 'object') {
    for (let i in value) {
      if (getType<EventCache>(value[i], 'Object')) {
        arr = arr.concat(unwrapId(value[i]));
      } else {
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

  @formatRes()
  @triggerEventReq
  on(eventArray: string[], callback: Function[]) {
    this._eventsCount += callback.length * eventArray.length;
    return this._addEvent(eventArray, callback);
  }

  private _addEvent(eventArray: string[], callback: Function[], realSize?: number) {
    const cache: EventCache = {};
    for (const eventName of eventArray) {
      let fnArray = this._events[eventName] || [];
      const id = Symbol(eventName);
      const sub = new EventSub(id, callback, realSize);
      fnArray.push(sub);
      this._events[eventName] = fnArray;
      cache[eventName] = id;
    }
    return cache;
  }

  @formatReq()
  emit(eventArray: string[], ...arg: any[]) {
    this._emitEvent(eventArray, ...arg);
  }

  private _emitEvent(eventArray: string[], ...arg: any[]) {
    eventArray.forEach(eventName => {
      const cbList = this._events[eventName];
      if (cbList) {
        cbList.forEach(item => {
          item.applyFunction(arg);
        });
      }
    });
  }

  @formatRes()
  @triggerEventReq
  once(eventArray: string[], callback: Function[]) {
    this._eventsCount += callback.length * eventArray.length;
    const cache = {};
    for (let item of eventArray) {
      const wrapObj: WrapObj = { id: null, cbArray: callback, eventName: item };
      const cb = onceWrap(item, wrapObj, this);
      const cacheItem = this._addEvent([ item ], [ cb ], callback.length);
      wrapObj.id = cacheItem[ item ];
      Object.assign(cache, cacheItem);
    }
    return cache;
  }

  @formatRes()
  @formatReq(false)
  removeEvent(eventArray: string[]) {
    const cache: boolean[] = [];
    for (const eventName of eventArray) {
      let flag = false;
      const fnArray = this._events[eventName];
      if (fnArray) {
        const num = fnArray.reduce((total, curr) => {
          return (total += curr.size);
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
  removeEventFunction(ids: symbol[]) {
    const cache: boolean[] = [];
    let removeNum = 0;
    for (const id of ids) {
      const eventName = getSymbolDes(id);
      const fnArray = this._events[eventName];
      let flag = false;
      if (fnArray) {
        const index = fnArray.findIndex(item => {
          if (item.id === id) {
            removeNum += item.size;
            return true;
          }
        });
        if (index >= 0) {
          flag = true;
          fnArray.splice(index, 1);
          // 如果当前监听队列为空，则删除当前监听对象
          if (!fnArray.length) delete this._events[eventName];
        }
      }
      cache.push(flag);
    }
    this._eventsCount -= removeNum;
    return cache;
  }
}

function onceWrap(eventArray: string, obj: any, target: MultiEvents): Function {
  return function() {
    target.removeEventFunction([obj.id]);
    for (let fn of obj.cbArray) {
      Reflect.apply(fn, target, arguments);
    }
  };
}

module.exports = MultiEvents
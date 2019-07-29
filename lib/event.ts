interface EventCache {
  [propName: string]: Symbol,
}

interface _events {
  [propName: string]: Array<{
    fn: Array<Function>,
    id: Symbol,
  }>;
}

interface EasyEvents {
  _events: _events;
  _eventsCount: number;
  constructor(): void;
  on(eventName: Array<string>, callback: Array<Function>): EventCache;
  emit(eventName: Array<string>, ...arg: Array<any>): void;
  removeEventFunction(id: Symbol): void;
}


function onEventCheck(target: any, key: string, descriptor: PropertyDescriptor): PropertyDescriptor {
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
    arguments[ 0 ] = Array.isArray(eventName) ? Array.from(new Set(eventName)) : [eventName];
    return Reflect.apply(fn, this, arguments);
  };
  return descriptor;
}

function emitEventCheck(target: any, key: string, descriptor: PropertyDescriptor): PropertyDescriptor {
  const fn = descriptor.value;
  descriptor.value = function(event: string | Array<string>) {
    if (typeof event === 'string') {
      arguments[0] = [event];
    } else if (Array.isArray(event)) {
      event.forEach(item => {
        if (typeof item !== 'string') {
          throw Error('parameter Error');
        }
      });
      arguments[0] = Array.from(new Set(event));
    } else {
      throw Error('parameter Error');
    }
    Reflect.apply(fn, this, arguments);
  };
  return descriptor;
}

function getSymbolDes(symbol: Symbol) {
  return symbol.description ? symbol.description : symbol.toString().replace(/^Symbol\((\S+)\)$/g, '$1');
}

class EasyEvents {
  constructor() {
    this._events = Object.create({});
    this._eventsCount = 0;
  }

  @onEventCheck
  on(eventArray: Array<string>, callback: Array<Function>) {
    this._eventsCount += callback.length * eventArray.length;
    const cache:EventCache = {};
    for (const eventName of eventArray) {
      let fnArray = this._events[eventName] || [];
      const id = Symbol(eventName);
      fnArray.push({
        fn: callback,
        id,
      });
      this._events[eventName] = fnArray;
      cache[ eventName ] = id;
    }
    return cache;
  }

  @emitEventCheck
  emit(eventArray: Array<string>, ...arg: Array<any>) {
    eventArray.forEach(eventName => {
      const cbList = this._events[eventName];
      if (cbList) {
        cbList.forEach(item => {
          item.fn.forEach(fn => {
            Reflect.apply(fn, this, arg)
          })
        });
      }
    });
  }

  removeEventFunction(id: Symbol) {
    const key = getSymbolDes(id);
    const fnArray = this._events[ key ];
    if (fnArray) {
      this._events[ key ] = fnArray.filter(item => {
        if (item.id !== id) {
          return false;
        }
      });
    } else {
      console.log(11);
    }
    console.log(key);
  }
}

module.exports = EasyEvents;

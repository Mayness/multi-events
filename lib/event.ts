
interface _events {
  [ propName: string ]: Array<Function>
}

interface EasyEvents {
  _events: _events;
  _eventsCount: number;
  constructor(): void;
  on(eventName: string, callback: Array<Function>): void;
  emit(eventName: Array<string>, ...arg: Array<any>):void;
}

function onEventCheck(target: any, key: string, descriptor: PropertyDescriptor):PropertyDescriptor {
  const fn = descriptor.value;
  descriptor.value = function (eventName: string, callback: Array<Function> | Function) {
    if (callback) {
      if (typeof callback === 'function') {
        callback = [ callback ]
      } else if (Array.isArray(callback)) {
        callback.forEach(fn => {
          if (typeof fn !== 'function') {
            throw Error('parameter Error')
          }
        })
      } else {
        throw Error('parameter Error');
      }
    } else {
      throw Error('Missing necessary parameters')
    }
    Reflect.apply(fn, this, arguments);
  }
  return descriptor;
}

function emitEventCheck(target: any, key: string, descriptor: PropertyDescriptor):PropertyDescriptor {
  const fn = descriptor.value;
  descriptor.value = function(event: string|Array<string>) {
    if (typeof event === 'string') {
      arguments[ 0 ] = [ event ];
    } else if (Array.isArray(event)) {
      event.forEach(item => {
        if (typeof item !== 'string') {
          throw Error('parameter Error');
        } 
      })
    } else {
      throw Error('parameter Error');
    }
    Reflect.apply(fn, this, arguments);
  }
  return descriptor;
}


class EasyEvents {
  constructor() {
    this._events = Object.create({});
    this._eventsCount = 0;
  }

  @onEventCheck
  on(eventName: string, callback: Array<Function>) {
    this._eventsCount += callback.length;
    if (this._events[ eventName ]) {
      this._events[ eventName ].concat(callback);
    } else {
      this._events[ eventName ] = callback;
    }
  }

  @emitEventCheck
  emit(eventArray: Array<string>, ...arg: Array<any>) {
    eventArray.forEach(eventName => {
      const cbList = this._events[ eventName ];
      if (cbList) {
        cbList.forEach(fn => Reflect.apply(fn, this, arg));
      }
    })
  }
}

module.exports = EasyEvents;
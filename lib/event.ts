interface ReflectApply {
  (target: object, receiver: EasyEvents, arg: Array<applyFunction>): void;
}

interface applyFunction {
  (): void;
}

interface _events {
  [ propName: string ]: Array<applyFunction>
}

interface EasyEvents {
  _events: _events;
  _eventsCount: number;
  constructor(): void;
  on(eventName: string, callback: applyFunction): void;
  emit(eventName: string, ...arg: Array<applyFunction>):void;
}




const R = typeof Reflect === 'object' ? Reflect : null
const ReflectApply: ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

function isFunction(params: object) {
  return typeof params === 'function';
}

class EasyEvents {
  constructor() {
    this._events = Object.create({});
    this._eventsCount = 0;
  }
  on(eventName: string, callback: applyFunction) {
    if (!isFunction(callback)) {
      throw TypeError('event callback must be Function');
    }
    this._eventsCount++;
    if (this._events[ eventName ]) {
      this._events[ eventName ].push(callback);
    } else {
      this._events[ eventName ] = [ callback ];
    }
  }
  emit(eventName: string, ...arg: Array<applyFunction>) {
    const cbList = this._events[ eventName ];
    if (cbList) {
      cbList.forEach(item => ReflectApply(item, this, arg));
    }
  }
}

module.exports = EasyEvents;
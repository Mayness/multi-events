class EasyEvents {
  constructor() {
    this._events = {};
  }
  on(name, fn) {
    validEventName(this, name);
    this._events[ name ] = fn;
  }
  emit(name, ...args) {
    if (this._events[ name ]) {
      functionApply(this._events[ name ], this, [ ...args ]);
    }
  }
}

function validEventName(target, name) {
  const validNameList = [ 'event_on', 'event_emit' ];
  if (validNameList.includes(name)) {
    throw Error(`event name is invalid: '${name}', please use another name to replace`);
  }
}

function functionApply(eventFn, target, args) {
  Function.prototype.apply.call(eventFn, target, args);
}




module.exports = EasyEvents;
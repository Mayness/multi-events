interface EventSub {
  id: Symbol,
  fnArray: Array<Function>,
  size: number,
  applyFunction(value:Array<any>):void;
}

// 单个订阅事件，以id为单位
class EventSub {
  constructor(id: Symbol, fnArray: Array<Function>) {
    this.id = id;
    this.fnArray = fnArray;
    this.size = fnArray.length;
  }
  applyFunction() {
    this.fnArray.forEach(fn => {
      Reflect.apply(fn, this, arguments[ 0 ]);
    })
  }
}

export default EventSub;

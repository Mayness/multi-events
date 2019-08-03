interface EventSub {
  id: Symbol,
  fnArray: Array<Function>,
  size: number,
  constructor(id: Symbol, fnArray: Array<Function>, realSize?: number): void;
  applyFunction(value:Array<any>):void;
}

// 单个订阅事件，以id为单位
class EventSub {
  /**
   * @description: 订阅事件类初始化
   * @param {Symbol} id 唯一识别
   * @param {Array<Function>} fnArray 订阅事件队列
   * @param {number} realSize 非必传， 当传入时表示订阅事件队列的真实长度，应用于被函数封装的队列 evet.ts 中的 onceWrap 方法
   * @return: null
   */
  constructor(id: Symbol, fnArray: Array<Function>, realSize?: number) {
    this.id = id;
    this.fnArray = fnArray;
    this.size = realSize ? realSize : fnArray.length;
  }
  applyFunction() {
    this.fnArray.forEach(fn => {
      Reflect.apply(fn, this, arguments[ 0 ]);
    })
  }
}

export default EventSub;

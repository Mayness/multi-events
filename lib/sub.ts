interface EventSub {
  id: symbol;
  fnArray: Function[];
  size: number;
  constructor(id: symbol, fnArray: Function[], realSize?: number): void;
  applyFunction(value: any[]): void;
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
  constructor(id: symbol, fnArray: Function[], realSize?: number) {
    this.id = id;
    this.fnArray = fnArray;
    this.size = realSize || fnArray.length;
  }
  applyFunction() {
    const arg = arguments[0];
    this.fnArray.forEach(fn => {
      Reflect.apply(fn, this, arg);
    });
  }
}
export default EventSub;
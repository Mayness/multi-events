export interface EventSub {
  id: Symbol,
  fnArray: Array<Function>,
  size: number,
  applyFunction(value:Array<any>):void;
}

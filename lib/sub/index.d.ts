export interface EventSub {
  id: Symbol,
  fnArray: Array<Function>,
  size: number,
  constructor(id: Symbol, fnArray: Array<Function>, realSize?: number): void;
  applyFunction(value:Array<any>):void;
}

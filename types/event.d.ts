interface EventSub {
  id: symbol;
  fnArray: Function[];
  size: number;
  constructor(id: symbol, fnArray: Function[], realSize?: number): void;
  applyFunction(value: any[]): void;
}

interface _events {
  [propName: string]: EventSub[];
}

interface EventCache {
  [propName: string]: symbol;
}

declare class MultiEvents {
  _events: _events;
  _eventsCount: number;
  constructor();
  on(eventName: string | string[], callback: Function | Function[]): EventCache;
  emit(eventName: string | string[], params: any): void;
  once(eventName: string | string[], callback: Function | Function[]): EventCache;
  removeEvent(eventArray: string | string[]): boolean[] | boolean;
  removeEventFunction(id: symbol | symbol[]): boolean[] | boolean;
}

export default MultiEvents;

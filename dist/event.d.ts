interface applyFunction {
    (): void;
}
interface _events {
    [propName: string]: Array<applyFunction>;
}
interface EasyEvents {
    _events: _events;
    _eventsCount: number;
    constructor(): void;
    on(eventName: string, callback: applyFunction): void;
    emit(eventName: string, ...arg: Array<applyFunction>): void;
}
declare function isFunction(target: any, key: string, descriptor: PropertyDescriptor): void;
declare class EasyEvents {
    constructor();
}

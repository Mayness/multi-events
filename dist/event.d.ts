interface ReflectApply {
    (target: object, receiver: EasyEvents, arg: Array<applyFunction>): void;
}
interface applyFunction {
    (): void;
}
interface _events {
    [propName: string]: Array<applyFunction>;
}
interface EasyEvents {
    _events: _events;
    _eventsCount: number;
    on(eventName: string, callback: applyFunction): void;
    emit(eventName: string, ...arg: Array<applyFunction>): void;
}
declare const R: typeof Reflect;
declare const ReflectApply: ReflectApply;
declare function isFunction(params: object): boolean;
declare class EasyEvents {
    constructor();
}

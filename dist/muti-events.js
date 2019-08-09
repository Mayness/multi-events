'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

// 单个订阅事件，以id为单位
var EventSub = function EventSub(id, fnArray, realSize) {
    this.id = id;
    this.fnArray = fnArray;
    this.size = realSize ? realSize : fnArray.length;
};
EventSub.prototype.applyFunction = function applyFunction () {
        var this$1 = this;

    var arg = arguments[0];
    this.fnArray.forEach(function (fn) {
        Reflect.apply(fn, this$1, arg);
    });
};

/** 内部方法解释
 * @description: on方法参数转换，需要同时转换订阅事件和方法
 * @param {string[] | string} eventName 订阅名称，需要转换为数组
 * @param {Function[] | Function} callback 订阅事件，需要转换为数组
 * @return: 改写descriptor
 */
function triggerEventReq(target, key, descriptor) {
    var fn = descriptor.value;
    descriptor.value = function (eventName, callback) {
        if (callback) {
            if (typeof callback === 'function') {
                callback = [callback];
            }
            else if (Array.isArray(callback)) {
                callback.forEach(function (fn) {
                    if (typeof fn !== 'function') {
                        throw Error('parameter Error');
                    }
                });
            }
            else {
                throw Error('parameter Error');
            }
        }
        else {
            throw Error('Missing necessary parameters');
        }
        var eventArray = Array.isArray(eventName) ? Array.from(new Set(eventName)) : [eventName];
        return Reflect.apply(fn, this, [eventArray, callback]);
    };
    return descriptor;
}
/**
 * @description: 通用格式化传入参数方法
 * @param {boolean} disRepeat 为指定参数去重去重，默认true
 * @param {number} index 需要格式化参数的小标，默认是第一个参数
 * @return {MethodDecorator} 方法装饰器，内部触发格式化后的参数
 */
function formatReq(disRepeat, index) {
    if ( disRepeat === void 0 ) disRepeat = true;
    if ( index === void 0 ) index = 0;

    return function (target, key, descriptor) {
        var fn = descriptor.value;
        descriptor.value = function () {
            var param = arguments[index];
            if (typeof param === 'string') {
                arguments[0] = [param];
            }
            else if (Array.isArray(param)) {
                if (disRepeat) {
                    arguments[0] = Array.from(new Set(param));
                }
            }
            else {
                throw Error('parameter Error');
            }
            return Reflect.apply(fn, this, arguments);
        };
        return descriptor;
    };
}
/**
 * @description: 通用格式化返回参数，传入参数是什么格式就返回什么格式
 * @param {resType} type 限定传入的数据类型，默认是array
 * @param {number} index 需要格式化参数的小标，默认是第一个参数
 * @return: {MethodDecorator} 方法装饰器，内部触发格式化后的返回值
 */
var resType;
(function (resType) {
    resType[resType["object"] = 0] = "object";
    resType[resType["array"] = 1] = "array";
})(resType || (resType = {}));
function formatRes(type, index) {
    if ( type === void 0 ) type = resType.array;
    if ( index === void 0 ) index = 0;

    return function (target, key, descriptor) {
        var fn = descriptor.value;
        descriptor.value = function () {
            var value = arguments[index];
            var data = Reflect.apply(fn, this, arguments);
            if (!data)
                { return; }
            // 传入参数为Array，返回String 或者 传入参数数为Object，返回Symbol，则结果就只返回第1位（如果结果是对象则返回值的第1位），反之则全返回
            var flag = (type === resType.array && getType(value, 'String')) || (type === resType.object && getType(value, 'Symbol'));
            return flag ? (Array.isArray(data) ? data[0] : Object.values(data)[0]) : data;
        };
        return descriptor;
    };
}
/**
 * 移除事件方法
 * @param {idType} ids
 * const cache1 = event.on(['test1', 'test2'], fn)
 * const cache2 = event.on(test1, fn)
 */
function removeEventFunctionCheck(target, key, descriptor) {
    var fn = descriptor.value;
    descriptor.value = function (ids) {
        var arr = unwrapId(ids);
        if (arr.length) {
            return Reflect.apply(fn, this, [arr]);
        }
        else {
            throw Error('parameter Error');
        }
    };
    return descriptor;
}
/**
 * @description: 获取Symbol名称
 * @param {symbol} symbol symbol唯一标识
 * @return: string
 */
function getSymbolDes(symbol) {
    return symbol ? (symbol.description ? symbol.description : symbol.toString().replace(/^Symbol\((\S+)\)$/g, '$1')) : '';
    // return symbol.toString().replace(/^Symbol\((\S+)\)$/g, '$1');
}
/**
 * @description: ts获取类型
 * @param {any} s 判断字段
 * @param {string} type 期望的类型
 * @return: 判断是否是该类型
 */
function getType(s, type) {
    return Object.prototype.toString.call(s).replace(/^\[object (\S+)\]/g, '$1') === type;
}
/**
 * @description: 转换参数 [{prop: Symbol}]、{prop:Symbol}、Symbol => [ Symbol ]
 * @param {idType} value
 * @return {Symbol[]}
 */
function unwrapId(value) {
    var arr = [];
    if (getType(value, 'Symbol')) {
        arr = [value];
    }
    else if (typeof value === 'object') {
        for (var i in value) {
            if (getType(value[i], 'Object')) {
                arr = arr.concat(unwrapId(value[i]));
            }
            else {
                arr.push(value[i]);
            }
        }
    }
    return arr;
}
var MultiEvents = function MultiEvents() {
    this._events = Object.create({});
    this._eventsCount = 0;
};
MultiEvents.prototype.on = function on (eventArray, callback) {
    this._eventsCount += callback.length * eventArray.length;
    return this._addEvent(eventArray, callback);
};
MultiEvents.prototype._addEvent = function _addEvent (eventArray, callback, realSize) {
    var cache = {};
    for (var eventName of eventArray) {
        var fnArray = this._events[eventName] || [];
        var id = Symbol(eventName);
        var sub = new EventSub(id, callback, realSize);
        fnArray.push(sub);
        this._events[eventName] = fnArray;
        cache[eventName] = id;
    }
    return cache;
};
MultiEvents.prototype.emit = function emit (eventArray) {
        var ref;

        var arg = [], len = arguments.length - 1;
        while ( len-- > 0 ) arg[ len ] = arguments[ len + 1 ];
    (ref = this)._emitEvent.apply(ref, [ eventArray ].concat( arg ));
};
MultiEvents.prototype._emitEvent = function _emitEvent (eventArray) {
        var this$1 = this;
        var arg = [], len = arguments.length - 1;
        while ( len-- > 0 ) arg[ len ] = arguments[ len + 1 ];

    eventArray.forEach(function (eventName) {
        var cbList = this$1._events[eventName];
        if (cbList) {
            cbList.forEach(function (item) {
                item.applyFunction(arg);
            });
        }
    });
};
MultiEvents.prototype.once = function once (eventArray, callback) {
    this._eventsCount += callback.length * eventArray.length;
    var cache = {};
    for (var item of eventArray) {
        var wrapObj = { id: null, cbArray: callback, eventName: item };
        var cb = onceWrap(item, wrapObj, this);
        var cacheItem = this._addEvent([item], [cb], callback.length);
        wrapObj.id = cacheItem[item];
        Object.assign(cache, cacheItem);
    }
    return cache;
};
MultiEvents.prototype.removeEvent = function removeEvent (eventArray) {
    var cache = [];
    for (var eventName of eventArray) {
        var flag = false;
        var fnArray = this._events[eventName];
        if (fnArray) {
            var num = fnArray.reduce(function (total, curr) {
                return (total += curr.size);
            }, 0);
            this._eventsCount -= num;
            delete this._events[eventName];
            flag = true;
        }
        cache.push(flag);
    }
    return cache;
};
MultiEvents.prototype.removeEventFunction = function removeEventFunction (ids) {
        var this$1 = this;

    var cache = [];
    var removeNum = 0;
    var loop = function () {
        var eventName = getSymbolDes(id);
        var fnArray = this$1._events[eventName];
        var flag = false;
        if (fnArray) {
            var index = fnArray.findIndex(function (item) {
                if (item.id === id) {
                    removeNum += item.size;
                    return true;
                }
            });
            if (index >= 0) {
                flag = true;
                fnArray.splice(index, 1);
                // 如果当前监听队列为空，则删除当前监听对象
                if (!fnArray.length)
                    { delete this$1._events[eventName]; }
            }
        }
        cache.push(flag);
    };

        for (var id of ids) loop();
    this._eventsCount -= removeNum;
    return cache;
};
__decorate([
    formatRes(),
    triggerEventReq
], MultiEvents.prototype, "on", null);
__decorate([
    formatReq()
], MultiEvents.prototype, "emit", null);
__decorate([
    formatRes(),
    triggerEventReq
], MultiEvents.prototype, "once", null);
__decorate([
    formatRes(),
    formatReq(false)
], MultiEvents.prototype, "removeEvent", null);
__decorate([
    formatRes(resType.object),
    removeEventFunctionCheck
], MultiEvents.prototype, "removeEventFunction", null);
function onceWrap(eventArray, obj, target) {
    return function () {
        var arguments$1 = arguments;

        target.removeEventFunction([obj.id]);
        for (var fn of obj.cbArray) {
            Reflect.apply(fn, target, arguments$1);
        }
    };
}
module.exports = MultiEvents;

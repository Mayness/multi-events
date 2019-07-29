var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// function isFunction(params: object) {
//   return typeof params === 'function';
// }
function isFunction(target, key, descriptor) {
    console.log(target);
}
var EasyEvents = /** @class */ (function () {
    function EasyEvents() {
        this._events = Object.create({});
        this._eventsCount = 0;
    }
    EasyEvents.prototype.on = function (eventName, callback) {
        // if (!isFunction(callback)) {
        //   throw TypeError('event callback must be Function');
        // }
        this._eventsCount++;
        if (this._events[eventName]) {
            this._events[eventName].push(callback);
        }
        else {
            this._events[eventName] = [callback];
        }
    };
    EasyEvents.prototype.emit = function (eventName) {
        var _this = this;
        var arg = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            arg[_i - 1] = arguments[_i];
        }
        var cbList = this._events[eventName];
        if (cbList) {
            cbList.forEach(function (fn) { return Reflect.apply(fn, _this, arg); });
        }
    };
    __decorate([
        isFunction
    ], EasyEvents.prototype, "on", null);
    return EasyEvents;
}());
module.exports = EasyEvents;
//# sourceMappingURL=event.js.map
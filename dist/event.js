var R = typeof Reflect === 'object' ? Reflect : null;
var ReflectApply = R && typeof R.apply === 'function'
    ? R.apply
    : function ReflectApply(target, receiver, args) {
        return Function.prototype.apply.call(target, receiver, args);
    };
function isFunction(params) {
    return typeof params === 'function';
}
var EasyEvents = /** @class */ (function () {
    function EasyEvents() {
        this._events = Object.create({});
        this._eventsCount = 0;
    }
    EasyEvents.prototype.on = function (eventName, callback) {
        if (!isFunction(callback)) {
            throw TypeError('event callback must be Function');
        }
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
            cbList.forEach(function (item) { return ReflectApply(item, _this, arg); });
        }
    };
    return EasyEvents;
}());
module.exports = EasyEvents;
//# sourceMappingURL=event.js.map
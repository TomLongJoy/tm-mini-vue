"use strict";
exports.__esModule = true;
exports.ref = void 0;
var shared_1 = require("../shared");
var effect_1 = require("./effect");
var reactive_1 = require("./reactive");
var RefImpl = /** @class */ (function () {
    function RefImpl(value) {
        this._rawValue = value;
        this._value = convert(value);
        // value -> reactive
        // 1. 看看value 是不是对象 
        this.dep = new Set();
    }
    Object.defineProperty(RefImpl.prototype, "value", {
        get: function () {
            trackRefValue(this);
            return this._value;
        },
        set: function (newValue) {
            //一定是先去修改了 value值，
            // newValue -> this._value
            //hasChanged
            // 对比的时候 object 
            if (shared_1.hasChanged(newValue, this._rawValue)) {
                this._rawValue = newValue;
                this._value = convert(newValue);
                effect_1.triggerEffects(this.dep);
            }
            ;
        },
        enumerable: false,
        configurable: true
    });
    return RefImpl;
}());
function trackRefValue(ref) {
    if (effect_1.isTracking()) {
        effect_1.trackEffects(ref.dep);
    }
}
function ref(value) {
    return new RefImpl(value);
}
exports.ref = ref;
function convert(value) {
    return shared_1.isObject(value) ? reactive_1.reactive(value) : value;
}
